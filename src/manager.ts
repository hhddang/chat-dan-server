type Room = {
  capacity: number;
  userIds: string[];
};

type User = {
  name: string;
  roomId?: string;
};

const ROOM_CAPACITIES: { [roomType: string]: number } = {
  global: 100,
  chat: 10,
  call: 4,
};

export class Manager {
  private rooms: { [roomId: string]: Room } = {};
  private users: { [userId: string]: User } = {};

  public addUser(userId: string, userName: string): void {
    this.users[userId] = {
      name: userName,
    };
  }

  public changeUserName(userId: string, newUserName: string): void {
    this.users[userId].name = newUserName;
  }

  public removeUser(userId: string): void {
    delete this.users[userId];
  }

  public join(roomType: string, roomId: string, userId: string): boolean {
    if (roomId in this.rooms) {
      const capacity = this.rooms[roomId].capacity;
      if (this.rooms[roomId].userIds.length >= capacity) {
        return false;
      } else {
        this.users[userId].roomId = roomId;
        this.rooms[roomId].userIds.push(userId);
        return true;
      }
    } else {
      this.users[userId].roomId = roomId;
      this.rooms[roomId] = {
        capacity: ROOM_CAPACITIES[roomType],
        userIds: [userId],
      };
      return true;
    }
  }

  public leave(roomId: string, userId: string): void {
    this.rooms[roomId].userIds = this.rooms[roomId].userIds.filter((id) => id !== userId);
    delete this.users[userId].roomId;

    if (this.rooms[roomId].userIds.length <= 0) {
      delete this.rooms[roomId];
    }
  }

  public userName(userId: string): string {
    return this.users[userId].name;
  }

  public currentRoomId(userId: string): string | undefined {
    if (!(userId in this.users)) {
      return undefined;
    }
    return this.users[userId].roomId;
  }

  public userIdsInRoom(roomId: string): string[] {
    return this.rooms[roomId].userIds;
  }

  public test() {
    console.log("users = ", this.users);
    console.log("rooms = ", this.rooms);
  }
}
