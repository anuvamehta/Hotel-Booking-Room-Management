const { totalFloors, roomsPerFloor, topFloorRooms } = require('./config');

// Returns the list of all rooms in the hotel as plain objects.
// Floors 1-9: rooms <floor>01 .. <floor>10. Floor 10: rooms 1001 .. 1007.
function buildRooms() {
  const rooms = [];
  for (let floor = 1; floor <= totalFloors; floor++) {
    const count = floor === totalFloors ? topFloorRooms : roomsPerFloor;
    for (let position = 0; position < count; position++) {
      const roomNumber = floor * 100 + (position + 1);
      rooms.push({ roomNumber, floor, position, isBooked: false });
    }
  }
  return rooms;
}

module.exports = { buildRooms };
