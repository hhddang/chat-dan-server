import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Manager } from "manager";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;
const manager = new Manager();

enum SocketEvent {
  CONNECT = "SK_CONNECT",
  GET_USERS = "SK_GET_USERS",
  ADD_USER = "SK_ADD_USER",
  REMOVE_USER = "SK_REMOVE_USER",
  JOIN_ROOM = "SK_JOIN_ROOM",
  LEAVE_ROOM = "SK_LEAVE_ROOM",
}

io.on("connection", (socket) => {
  let userId: string = socket.id;
  let userName: string = "n/a";
  let currentRoomId: string | null = null;

  socket.on(SocketEvent.CONNECT, (name: string) => {
    socket.emit(SocketEvent.CONNECT, userId);
    userName = name;
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomType: string, roomId: string) => {
    const status = manager.join(roomType, roomId, userId, userName);
    const user = { id: userId, name: userName };
    socket.join(roomId);
    socket.emit(SocketEvent.JOIN_ROOM, status);
    socket.to(roomId).emit(SocketEvent.ADD_USER, user);
    currentRoomId = roomId;

    setTimeout(() => {
      console.log(roomType, roomId, userId, userName);
    }, 2000);
  });

  socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
    socket.to(roomId).emit(SocketEvent.REMOVE_USER, userId);
    socket.leave(roomId);
    currentRoomId = null;
  });

  socket.on("disconnect", () => {
    if (currentRoomId) {
      socket.to(currentRoomId).emit(SocketEvent.REMOVE_USER, userId);
    }
  });

  socket.onAny((event, data) => {
    if (!(event in Object.values(SocketEvent))) {
      socket.to(currentRoomId!).emit(event, data);
    }
  });

  // socket.on(SocketEvent.CONNECT, (userName?: string) => {
  //   userId = manager.addUser(userName);
  //   socket.emit(SocketEvent.CONNECT, userId);
  // });

  // socket.on(SocketEvent.JOIN_ROOM, (roomType: string, roomId: string) => {
  //   const status = manager.joinRoom(roomType, roomId, userId);
  //   socket.emit(SocketEvent.JOIN_ROOM, status);
  //   socket.to(roomId).emit(SocketEvent.ADD_USER, userId);
  // });

  // socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
  //   manager.leaveRoom(roomId, userId);
  //   socket.to(roomId).emit(SocketEvent.REMOVE_USER, userId);
  // });

  // socket.on(SocketEvent.GET_USERS, () => {
  //   const roomId = manager.getRoomId(userId);

  //   if (roomId) {
  //     const room = manager.socket.emit(SocketEvent.GET_USERS, manager.getUSers);
  //   }

  //   socket.on(SocketEvent.LEAVE_ROOM, () => {
  //     const roomId = "";
  //     socket.emit(SocketEvent.REMOVE_USER, userId);
  //     socket.leave(roomId);
  //   });
  // });

  // socket.on("disconnect", () => {
  //   const roomId = manager.getRoomId(userId);
  //   manager.disconnect(userId);
  //   if (roomId) {
  //     socket.to(roomId).emit(SocketEvent.REMOVE_USER, socket.id);
  //   }
  // });

  // socket.on(SocketEvent.CREATE_ROOM, (roomType: RoomType) => {
  //   const roomId = manager.createRoom(roomType);
  //   socket.emit(SocketEvent.CREATE_ROOM, roomId);
  // });

  // socket.on(SocketEvent.JOIN_ROOM, (roomType: RoomType, roomId: string) => {
  //   manager.joinRoom(roomId, userId);
  // });

  // socket.on(SocketEvent.LEAVE_ROOM, () => {
  //   const roomId = manager.getRoomId(userId);
  //   if (roomId) {
  //     const userIds = manager.getUserIds(roomId);
  //     manager.leaveRoom(userId);
  //     if (userIds.length <= 0) {
  //       manager.deleteRoom(roomId);
  //     }
  //   }
  // });

  // socket.on(SocketEvent.DATA, (id: string, key: string, data: unknown) => {
  //   socket.to(id).emit(SocketEvent.DATA, key, data);
  // });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
