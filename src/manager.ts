import { generateId } from "@utils";

// export type Room = {
//   capacity: number;
//   userIds: string[];
// };

// export type User = {
//   name: string;
//   currentRoomId: string | null;
// };

// export type RoomManager = {
//   [roomId: string]: Room;
// };

// export type UserManager = {
//   [userId: string]: User;
// };

// type RoomCapacity = {
//   [roomType: string]: number;
// };

// // ------------------

// export class Manager {
//   private users: UserManager = {};
//   private rooms: RoomManager = {};
//   private capacities: RoomCapacity = {
//     global: 100,
//     chat: 10,
//     call: 4,
//   };

//   public addUser(name?: string): string {
//     let userId: string;
//     do {
//       userId = generateId(6);
//     } while (userId in Object.keys(this.users));
//     this.users[userId] = { name: name ?? userId, currentRoomId: null };
//     return userId;
//   }

//   public changeUserName(userId: string, name: string): void {
//     this.users[userId].name = name;
//   }

//   public deleteUser(userId: string): void {
//     delete this.users[userId];
//   }

//   public joinRoom(roomType: string, roomId: string, userId: string): boolean {
//     if (roomId in this.rooms) {
//       const room = this.rooms[roomId];
//       const isOverCapacity = room.userIds.length >= room.capacity;
//       if (isOverCapacity) {
//         return false;
//       } else {
//         room.userIds.push(userId);
//         this.users[userId].currentRoomId = roomId;
//         return true;
//       }
//     } else {
//       this.rooms[roomId] = { capacity: this.capacities[roomType], userIds: [userId] };
//       this.users[userId].currentRoomId = roomId;
//       return true;
//     }
//   }

//   public leaveRoom(roomId: string, userId: string): void {
//     const room = this.rooms[roomId];
//     this.users[userId].currentRoomId = null;
//     room.userIds = room.userIds.filter((id) => id !== userId);
//     if (room.userIds.length <= 0) {
//       delete this.rooms[roomId];
//     }
//   }
// }

// ------------------------------
type UserId = string;
type UserName = string;
type RoomId = string;
type Room = {
  [userId: UserId]: UserName;
};

export class Manager {
  private rooms: { [roomId: RoomId]: Room } = {};

  public join(roomId: RoomId, userId: UserId, userName: UserName): void {
    if (roomId in this.rooms) {
      this.rooms[roomId][userId] = userName;
    } else {
      this.rooms[roomId] = {
        [userId]: userName,
      };
    }
  }

  public leave(roomId: RoomId, userId: UserId): void {
    delete this.rooms[roomId][userId];

    if (Object.keys(this.rooms[roomId]).length <= 0) {
      delete this.rooms[roomId];
    }
  }
}
