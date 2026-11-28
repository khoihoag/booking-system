const users = {
  player: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Test Player',
    email: 'player@test.com',
    password: 'password123',
    role: 'user',
    active: 1,
  },
  otherPlayer: {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Other Player',
    email: 'other-player@test.com',
    password: 'password123',
    role: 'user',
    active: 1,
  },
  pitchOwner: {
    id: '33333333-3333-4333-8333-333333333333',
    name: 'Test Pitch Owner',
    email: 'owner@test.com',
    password: 'password123',
    role: 'pitch_owner',
    active: 1,
  },
  admin: {
    id: '44444444-4444-4444-8444-444444444444',
    name: 'Test Admin',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    active: 1,
  },
  inactiveUser: {
    id: '55555555-5555-4555-8555-555555555555',
    name: 'Inactive User',
    email: 'inactive@test.com',
    password: 'password123',
    role: 'user',
    active: 0,
  },
};

module.exports = users;
