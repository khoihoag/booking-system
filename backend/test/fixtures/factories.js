const crypto = require('crypto');

const uuid = () => crypto.randomUUID();

const dateOnly = (daysFromToday = 1) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return date.toISOString().slice(0, 10);
};

const dateTime = (minutesFromNow = 10) =>
  new Date(Date.now() + minutesFromNow * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');

const makeUser = (overrides = {}) => {
  const id = overrides.id || uuid();
  const suffix = id.slice(0, 8);

  return {
    id,
    name: `Test User ${suffix}`,
    email: `user-${suffix}@test.com`,
    password: 'password123',
    role: 'user',
    active: 1,
    ...overrides,
  };
};

const makePitch = (overrides = {}) => ({
  id: uuid(),
  ownerId: uuid(),
  name: `Test Pitch ${uuid().slice(0, 8)}`,
  address: 'District 1, Ho Chi Minh City',
  status: 'active',
  pitchType: '7-a-side',
  rating: 5.0,
  description: 'Test artificial turf pitch',
  facilities: JSON.stringify(['parking', 'lights']),
  pricePerHour: 200000,
  ...overrides,
});

const makeTimeSlot = (overrides = {}) => ({
  id: uuid(),
  pitchId: uuid(),
  startTime: '18:00:00',
  endTime: '19:30:00',
  price: 200000,
  isPeakHour: 1,
  ...overrides,
});

const makeBooking = (overrides = {}) => ({
  id: uuid(),
  userId: uuid(),
  timeSlotId: [uuid()],
  date: dateOnly(),
  status: 'pending',
  expiresAt: dateTime(10),
  paidAt: null,
  refundedAt: null,
  completedAt: null,
  ...overrides,
});

const makeBookingPayload = (overrides = {}) => ({
  timeSlotId: [uuid()],
  date: dateOnly(),
  ...overrides,
});

const makeScenario = (overrides = {}) => {
  const player = makeUser({ role: 'user', ...(overrides.player || {}) });
  const owner = makeUser({ role: 'pitch_owner', ...(overrides.owner || {}) });
  const admin = makeUser({ role: 'admin', ...(overrides.admin || {}) });
  const pitch = makePitch({ ownerId: owner.id, ...(overrides.pitch || {}) });
  const firstSlot = makeTimeSlot({
    pitchId: pitch.id,
    ...(overrides.firstSlot || {}),
  });
  const secondSlot = makeTimeSlot({
    pitchId: pitch.id,
    startTime: '20:00:00',
    endTime: '21:30:00',
    ...(overrides.secondSlot || {}),
  });
  const booking = makeBooking({
    userId: player.id,
    timeSlotId: [firstSlot.id],
    ...(overrides.booking || {}),
  });

  return {
    users: { player, owner, admin },
    pitches: { main: pitch },
    timeSlots: { first: firstSlot, second: secondSlot },
    bookings: { pending: booking },
  };
};

module.exports = {
  uuid,
  dateOnly,
  dateTime,
  makeUser,
  makePitch,
  makeTimeSlot,
  makeBooking,
  makeBookingPayload,
  makeScenario,
};
