type Room = {
  capacity: number;
  members: string[];
};

type RoomManager = {
  [roomId: string]: Room;
};

const rooms: RoomManager = {
  global: {
    capacity: 100,
    members: [],
  },
};

delete rooms["global"];

const joinApp = (): string => {
  const userId = Math.random() * 100 + "";
  return userId;
};

const joinRoom = (roomId: string, user: string): boolean => {
  const room = rooms[roomId];
  if (room.members.length >= room.capacity) {
    return false;
  } else {
    room.members.push(user);
    return true;
  }
};

const leaveRoom = (roomId: string, user: string): boolean => {
  const room = rooms[roomId];
  room.members = room.members.filter((member) => member !== user);
  return true;
};

const;
