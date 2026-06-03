module.exports = {
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/hotel_reservation',
  // Floors 1-9 have 10 rooms each, floor 10 has 7 rooms.
  totalFloors: 10,
  roomsPerFloor: 10,
  topFloorRooms: 7,
  maxRoomsPerBooking: 5,
  horizontalMinutesPerRoom: 1,
  verticalMinutesPerFloor: 2,
};
