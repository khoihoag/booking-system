const bookings = {
  pending: {
    id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    userId: '11111111-1111-4111-8111-111111111111',
    timeSlotId: ['88888888-8888-4888-8888-888888888888'],
    date: '2026-12-01',
    status: 'pending',
    expiresAt: '2026-12-01 10:10:00',
  },
  confirmed: {
    id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    userId: '11111111-1111-4111-8111-111111111111',
    timeSlotId: ['99999999-9999-4999-8999-999999999999'],
    date: '2026-12-02',
    status: 'confirmed',
    expiresAt: null,
    paidAt: '2026-12-01 10:00:00',
  },
  expired: {
    id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    userId: '11111111-1111-4111-8111-111111111111',
    timeSlotId: ['88888888-8888-4888-8888-888888888888'],
    date: '2026-12-03',
    status: 'pending',
    expiresAt: '2026-12-01 09:00:00',
  },
};

module.exports = bookings;
