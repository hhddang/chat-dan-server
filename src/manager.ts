import { generateId } from "@utils";

export type Room = {
  capacity: number;
  userIds: string[];
};

export type User = {
  name: string;
  currentRoomId: string | null;
};

export type RoomManager = {
  [roomId: string]: Room;
};

export type UserManager = {
  [userId: string]: User;
};

type RoomCapacity = {
  [roomType: string]: number;
};

// ------------------

export class Manager {
  private users: UserManager = {};
  private rooms: RoomManager = {};
  private capacities: RoomCapacity = {
    global: 100,
    chat: 10,
    call: 4,
  };

  public addUser(name?: string): string {
    let userId: string;
    do {
      userId = generateId(6);
    } while (userId in Object.keys(this.users));
    this.users[userId] = { name: name ?? userId, currentRoomId: null };
    return userId;
  }

  public changeUserName(userId: string, name: string): void {
    this.users[userId].name = name;
  }

  public deleteUser(userId: string): void {
    delete this.users[userId];
  }

  public joinRoom(roomType: string, roomId: string, userId: string): boolean {
    if (roomId in this.rooms) {
      const room = this.rooms[roomId];
      const isOverCapacity = room.userIds.length >= room.capacity;
      if (isOverCapacity) {
        return false;
      } else {
        room.userIds.push(userId);
        this.users[userId].currentRoomId = roomId;
        return true;
      }
    } else {
      this.rooms[roomId] = { capacity: this.capacities[roomType], userIds: [userId] };
      this.users[userId].currentRoomId = roomId;
      return true;
    }
  }

  public leaveRoom(roomId: string, userId: string): void {
    const room = this.rooms[roomId];
    this.users[userId].currentRoomId = null;
    room.userIds = room.userIds.filter((id) => id !== userId);
    if (room.userIds.length <= 0) {
      delete this.rooms[roomId];
    }
  }
}

export class Manager2 {
  private users: UserManager = {};
  private rooms: RoomManager = {};

  private generateUserId(): string {
    let userId: string;
    do {
      userId = generateId(6);
    } while (userId in Object.keys(this.users));
    return userId;
  }

  public checkRoomExisted(roomId: string): boolean {
    return roomId in this.rooms;
  }

  public newUser(name?: string): string {
    const userId = this.generateUserId();
    this.users[userId] = { name: name ?? userId, currentRoomId: null };
    return userId;
  }

  public createRoom(roomType: string, roomId: string): void {
    let capacity = -1;

    switch (roomType) {
      case "global":
        capacity = 100;
      case "chat":
        capacity = 10;
      case "call":
        capacity = 4;
    }

    this.rooms[roomId] = { capacity, userIds: [] };
  }

  public joinRoom(roomId: string, userId: string): boolean {
    const room = this.rooms[roomId];
    const user = this.users[userId];
    const isOverCapacity = room.userIds.length >= room.capacity;
    if (isOverCapacity) {
      return false;
    } else {
      room.userIds.push(userId);
      user.currentRoomId = roomId;
      return true;
    }
  }

  public leaveRoom(userId: string): void {
    const roomId = this.users[userId].currentRoomId;
    if (roomId) {
      const room = this.rooms[roomId];

      this.users[userId].currentRoomId = null;
      room.userIds = room.userIds.filter((id) => id !== userId);
      if (room.userIds.length <= 0) {
        this.deleteRoom(roomId);
      }
    }
  }

  public getCurrentRoomId(userId: string): string | null {
    return this.users[userId].currentRoomId;
  }

  public deleteRoom(roomId: string): void {
    delete this.rooms[roomId];
  }
}
