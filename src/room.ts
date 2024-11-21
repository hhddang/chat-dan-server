type UserId = string;
type RoomId = string;
type Room = {
  capacity: number;
  userIds: UserId[];
};

type UserManager = {
  [userId: UserId]: RoomId | null;
};

type RoomManager = {
  [roomId: RoomId]: Room;
};

// ------------------

let userManager: UserManager = {};

let roomManager: RoomManager = {
  global: {
    capacity: 100,
    userIds: [],
  },
};

const joinApp = (): string => {
  const userId = (Math.random() * 100 + "") as UserId;
  userManager[userId] = null;
  return userId;
};

const leaveApp = (userId: UserId): boolean => {
  delete userManager[userId];
  return true;
};

const joinRoom = (roomId: RoomId, userId: UserId): boolean => {
  const isExisted = roomId in roomManager;
  if (isExisted) {
    const room = roomManager[roomId];
    const isOverCapacity = room.userIds.length >= room.capacity;
    if (isOverCapacity) {
      return false;
    } else {
      room.userIds.push(userId);
      userManager[userId] = roomId;
      return true;
    }
  } else {
    roomManager[roomId] = {
      capacity: 100, // handle this ....
      userIds: [userId],
    };
    userManager[userId] = roomId;
    return true;
  }
};

const leaveRoom = (userId: UserId): boolean => {
  const roomId = userManager[userId];
  if (roomId) {
    const room = roomManager[roomId];
    room.userIds = room.userIds.filter((id) => id !== userId);
    if (room.userIds.length <= 0) {
      delete roomManager[roomId];
    }
    userManager[userId] = null;

    return true;
  } else {
    return false;
  }
};
