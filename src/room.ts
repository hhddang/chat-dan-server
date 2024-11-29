type Room = {
  capacity: number;
  userIds: string[];
};

type UserManager = {
  [userId: string]: string | null;
};

type RoomManager = {
  [roomId: string]: Room;
};

export enum RoomType {
  GLOBAL = "GLOBAL",
  CHAT = "CHAT",
  CALL = "CALL",
}

// ------------------

export class Manager {
  private userManager: UserManager = {};
  private roomManager: RoomManager = {};

  public joinApp(): string {
    const userId = (Math.random() * 100 + "") as string;
    this.userManager[userId] = null;
    return userId;
  }

  public leaveApp(userId: string): boolean {
    delete this.userManager[userId];
    return true;
  }

  public createRoom(roomType: RoomType): string {
    const roomId = roomType === RoomType.GLOBAL ? "global" : Math.random() * 100 + "";
    let capacity = -1;

    switch (roomType) {
      case RoomType.GLOBAL:
        capacity = 100;
      case RoomType.CHAT:
        capacity = 10;
      case RoomType.CALL:
        capacity = 4;
    }

    this.roomManager[roomId] = {
      capacity,
      userIds: [],
    };

    return roomId;
  }

  public deleteRoom(roomId: string): boolean {
    delete this.roomManager[roomId];
    return true;
  }

  public joinRoom(roomId: string, userId: string): boolean {
    const room = this.roomManager[roomId];
    const isOverCapacity = room.userIds.length >= room.capacity;
    if (isOverCapacity) {
      return false;
    } else {
      room.userIds.push(userId);
      this.userManager[userId] = roomId;
      return true;
    }
  }

  public leaveRoom(userId: string): boolean {
    const roomId = this.userManager[userId];
    if (roomId) {
      const room = this.roomManager[roomId];
      room.userIds = room.userIds.filter((id) => id !== userId);
      this.userManager[userId] = null;
      return true;
    }
    return false;
  }

  public getRoomId(userId: string): string | null {
    return this.userManager[userId];
  }

  public getUserIds(roomId: string): string[] {
    return this.roomManager[roomId].userIds;
  }
}
