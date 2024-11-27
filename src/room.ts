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

export class Manager {
  userManager: UserManager = {};
  roomManager: RoomManager = {};

  joinApp = (): string => {
    const userId = (Math.random() * 100 + "") as UserId;
    this.userManager[userId] = null;
    return userId;
  };

  leaveApp = (userId: UserId): boolean => {
    delete this.userManager[userId];
    return true;
  };

  createRoom = (roomType: "global" | "chat" | "call"): string => {
    const roomId = roomType === "global" ? "global" : Math.random() * 100 + "";
    let capacity = -1;

    switch (roomType) {
      case "global":
        capacity = 100;
      case "chat":
        capacity = 10;
      case "call":
        capacity = 4;
    }

    this.roomManager[roomId] = {
      capacity,
      userIds: [],
    };

    return roomId;
  };

  removeRoom = (roomId: string): boolean => {
    delete this.roomManager[roomId];
    return true;
  };

  joinRoom = (roomId: RoomId, userId: UserId): boolean => {
    const room = this.roomManager[roomId];
    const isOverCapacity = room.userIds.length >= room.capacity;
    if (isOverCapacity) {
      return false;
    } else {
      room.userIds.push(userId);
      this.userManager[userId] = roomId;
      return true;
    }
  };

  leaveRoom = (roomId: RoomId, userId: UserId): boolean => {
    const room = this.roomManager[roomId];
    room.userIds = room.userIds.filter((id) => id !== userId);
    this.userManager[userId] = null;
    return true;
  };

  getRoomId(userId: string): string | null {
    return this.userManager[userId];
  }
}
