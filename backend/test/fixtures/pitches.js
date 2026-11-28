const pitches = {
  main: {
    id: '66666666-6666-4666-8666-666666666666',
    ownerId: '33333333-3333-4333-8333-333333333333',
    name: 'Apex Football Pitch',
    address: 'District 1, Ho Chi Minh City',
    status: 'active',
    pitchType: '7-a-side',
    rating: 5.0,
    description: 'Artificial turf pitch',
    facilities: JSON.stringify(['parking', 'lights']),
    pricePerHour: 200000,
  },
  second: {
    id: '77777777-7777-4777-8777-777777777777',
    ownerId: '33333333-3333-4333-8333-333333333333',
    name: 'Second Football Pitch',
    address: 'District 3, Ho Chi Minh City',
    status: 'active',
    pitchType: '5-a-side',
    rating: 4.5,
    description: 'Indoor pitch',
    facilities: JSON.stringify(['parking']),
    pricePerHour: 150000,
  },
};

module.exports = pitches;
