const bcrypt = require('bcryptjs');
const pool = require('../../src/config/database');
const { users, pitches, timeSlots } = require('../fixtures');

const assertTestDatabase = () => {
  const databaseName = process.env.TEST_DB_NAME || process.env.DB_NAME || '';
  if (!/(test|testing)$/i.test(databaseName)) {
    throw new Error(
      `Refusing to mutate non-test database "${databaseName}". Set TEST_DB_NAME or use a DB_NAME ending in _test.`,
    );
  }
};

const resetDatabase = async () => {
  assertTestDatabase();
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  for (const table of [
    'bookingTimeSlots',
    'bookings',
    'timeSlots',
    'pitchImages',
    'pitches',
    'users',
  ]) {
    await pool.query(`TRUNCATE TABLE ${table}`);
  }
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
};

const insertUser = async (user) => {
  const password = await bcrypt.hash(user.password, 4);
  await pool.execute(
    `INSERT INTO users (id, name, email, password, role, active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user.id, user.name, user.email, password, user.role, user.active],
  );
};

const seedBaseData = async () => {
  assertTestDatabase();

  for (const user of Object.values(users)) await insertUser(user);

  for (const pitch of Object.values(pitches)) {
    await pool.execute(
      `INSERT INTO pitches
       (id, ownerId, name, address, status, pitchType, rating, description, facilities, pricePerHour)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pitch.id,
        pitch.ownerId,
        pitch.name,
        pitch.address,
        pitch.status,
        pitch.pitchType,
        pitch.rating,
        pitch.description,
        pitch.facilities,
        pitch.pricePerHour,
      ],
    );
  }

  for (const slot of Object.values(timeSlots)) {
    await pool.execute(
      `INSERT INTO timeSlots
       (id, pitchId, startTime, endTime, price, isPeakHour)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        slot.id,
        slot.pitchId,
        slot.startTime,
        slot.endTime,
        slot.price,
        slot.isPeakHour,
      ],
    );
  }
};

const insertBooking = async (booking) => {
  assertTestDatabase();
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO bookings
       (id, userId, bookingDate, status, expiresAt, paidAt, refundedAt, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.id,
        booking.userId,
        booking.date,
        booking.status,
        booking.expiresAt || null,
        booking.paidAt || null,
        booking.refundedAt || null,
        booking.completedAt || null,
      ],
    );

    for (const slotId of booking.timeSlotId) {
      await connection.execute(
        'INSERT INTO bookingTimeSlots (bookingId, timeSlotId) VALUES (?, ?)',
        [booking.id, slotId],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const closeDatabase = () => pool.end();

module.exports = {
  assertTestDatabase,
  resetDatabase,
  seedBaseData,
  insertBooking,
  closeDatabase,
};
