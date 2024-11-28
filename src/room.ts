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

// ------------------

export class Manager {
  private userManager: UserManager = {};
  private roomManager: RoomManager = {};

  public joinApp (): string {
    const userId = (Math.random() * 100 + "") as string;
    this.userManager[userId] = null;
    return userId;
  };

  public leaveApp (userId: string): boolean {
    delete this.userManager[userId];
    return true;
  };

  public createRoom (roomType: "global" | "chat" | "call"): string {
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

  public removeRoom (roomId: string): boolean {
    delete this.roomManager[roomId];
    return true;
  };

  public joinRoom (roomId: string, userId: string): boolean {
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

  public leaveRoom (roomId: string, userId: string): boolean {
    const room = this.roomManager[roomId];
    room.userIds = room.userIds.filter((id) => id !== userId);
    this.userManager[userId] = null;
    return true;
  };

  public getRoomId(userId: string): string | null {
    return this.userManager[userId];
  }

  public getUserIds(roomId: string): string[] {
    return this.
  }
}
