const pool = require("../config/database");
const crypto = require("crypto");

const load = async (where = "", params = []) => {
  const [rows] = await pool.execute(
    `SELECT b.*, u.name AS userName, u.email AS userEmail, ts.id AS slotId, ts.pitchId, p.name AS pitchName, p.address AS pitchAddress FROM bookings b JOIN users u ON u.id = b.userId LEFT JOIN bookingTimeSlots bts ON bts.bookingId = b.id LEFT JOIN timeSlots ts ON ts.id = bts.timeSlotId LEFT JOIN pitches p ON p.id = ts.pitchId ${where} ORDER BY b.bookingDate DESC, b.createdAt DESC`,
    params,
  );
  const result = new Map();
  for (const row of rows) {
    let booking = result.get(row.id);
    if (!booking) {
      booking = {
        ...row,
        id: row.id,
        userId: row.userId,
        expiresAt: row.expiresAt,
        paidAt: row.paidAt,
        refundedAt: row.refundedAt,
        completedAt: row.completedAt,
        date: row.bookingDate,
        timeSlotId: [],
        userId: { id: row.userId, name: row.userName, email: row.userEmail },
      };
      delete booking.slotId;
      result.set(row.id, booking);
    }
    if (row.slotId)
      booking.timeSlotId.push({
        id: row.slotId,
        pitchId: row.pitchId,
        pitch: {
          id: row.pitchId,
          name: row.pitchName,
          address: row.pitchAddress,
        },
      });
  }
  return [...result.values()];
};
exports.create = async (data) => {
  const ids = Array.isArray(data.timeSlotId)
    ? data.timeSlotId
    : [data.timeSlotId];
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const bookingId = crypto.randomUUID();
    await conn.execute(
      "INSERT INTO bookings (id, userId, bookingDate, status, expiresAt) VALUES (?, ?, ?, ?, ?)",
      [
        bookingId,
        data.userId,
        data.date,
        data.status || "pending",
        data.expiresAt || new Date(Date.now() + 600000),
      ],
    );
    for (const slotId of ids)
      await conn.execute(
        "INSERT INTO bookingTimeSlots (bookingId, timeSlotId) VALUES (?, ?)",
        [bookingId, slotId],
      );
    await conn.commit();
    return (await load("WHERE b.id = ?", [bookingId]))[0];
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};
exports.findAll = async (filter = {}) =>
  load(
    filter.status ? "WHERE b.status = ?" : "",
    filter.status ? [filter.status] : [],
  );
exports.findById = async (id) => (await load("WHERE b.id = ?", [id]))[0];
exports.findByUser = async (userId) => load("WHERE b.userId = ?", [userId]);
exports.findByPitchIdNDate = async (pitchId, date) =>
  load(
    "WHERE b.bookingDate = ? AND b.status <> 'cancelled' AND EXISTS (SELECT 1 FROM bookingTimeSlots x JOIN timeSlots y ON y.id = x.timeSlotId WHERE x.bookingId = b.id AND y.pitchId = ?)",
    [date, pitchId],
  );
exports.expirePending = async () => {
  const [r] = await pool.execute(
    "UPDATE bookings SET status = 'cancelled' WHERE status = 'pending' AND expiresAt <= NOW()",
  );
  return r;
};
exports.update = async (id, data) => {
  const fields = Object.keys(data).filter((f) =>
    ["status", "paidAt", "refundedAt", "completedAt", "expiresAt"].includes(f),
  );
  if (!fields.length) return exports.findById(id);
  const [r] = await pool.execute(
    `UPDATE bookings SET ${fields.map((f) => `${f} = ?`).join(", ")} WHERE id = ?`,
    [...fields.map((f) => data[f]), id],
  );
  return r.affectedRows ? exports.findById(id) : null;
};
exports.delete = async (id) => {
  const old = await exports.findById(id);
  if (!old) return null;
  await pool.execute("DELETE FROM bookings WHERE id = ?", [id]);
  return old;
};
