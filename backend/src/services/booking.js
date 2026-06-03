const { verticalMinutesPerFloor, horizontalMinutesPerRoom } = require('../config');

// Travel time between two rooms.
// Same floor: horizontal distance only.
// Different floors: walk to the stairs, change floors, then walk to the target.
function travelTime(a, b) {
  if (a.floor === b.floor) {
    return Math.abs(a.position - b.position) * horizontalMinutesPerRoom;
  }
  const vertical = Math.abs(a.floor - b.floor) * verticalMinutesPerFloor;
  const horizontal = (a.position + b.position) * horizontalMinutesPerRoom;
  return vertical + horizontal;
}

// Travel time spanning a selection = time between its first and last room.
function selectionTravelTime(rooms) {
  if (rooms.length < 2) return 0;
  return travelTime(rooms[0], rooms[rooms.length - 1]);
}

// Best set of `count` rooms on a single floor: the contiguous window (by position)
// with the smallest horizontal span. Returns null if the floor cannot fit them.
function bestOnSingleFloor(available, count) {
  const byFloor = new Map();
  for (const room of available) {
    if (!byFloor.has(room.floor)) byFloor.set(room.floor, []);
    byFloor.get(room.floor).push(room);
  }

  let best = null;
  for (const [floor, rooms] of byFloor) {
    if (rooms.length < count) continue;
    rooms.sort((a, b) => a.position - b.position);
    for (let i = 0; i + count <= rooms.length; i++) {
      const window = rooms.slice(i, i + count);
      const span = selectionTravelTime(window);
      if (
        !best ||
        span < best.span ||
        (span === best.span && floor < best.floor)
      ) {
        best = { rooms: window, span, floor };
      }
    }
  }
  return best;
}

// Best set of `count` rooms across floors: slide a window over all available
// rooms sorted by (floor, position) and minimize the spanning travel time.
function bestAcrossFloors(available, count) {
  const sorted = [...available].sort(
    (a, b) => a.floor - b.floor || a.position - b.position
  );

  let best = null;
  for (let i = 0; i + count <= sorted.length; i++) {
    const window = sorted.slice(i, i + count);
    const time = selectionTravelTime(window);
    if (!best || time < best.time) {
      best = { rooms: window, time };
    }
  }
  return best;
}

// Decide which rooms to book given the available rooms and requested count.
// Rule order: same floor first, otherwise minimize total travel time.
function selectRooms(available, count) {
  if (available.length < count) {
    return { error: `Only ${available.length} rooms available, cannot book ${count}.` };
  }

  const singleFloor = bestOnSingleFloor(available, count);
  const chosen = singleFloor
    ? singleFloor.rooms
    : bestAcrossFloors(available, count).rooms;

  return { rooms: chosen, travelTime: selectionTravelTime(chosen) };
}

module.exports = { travelTime, selectionTravelTime, selectRooms };
