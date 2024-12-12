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
  JOIN_ROOM = "SK_JOIN_ROOM",
  LEAVE_ROOM = "SK_LEAVE_ROOM",
  GET_USERS = "SK_GET_USERS",
  USER_JOIN = "SK_USER_JOIN",
  USER_LEAVE = "SK_USER_LEAVE",
  CHANGE_NAME = "SK_CHANGE_NAME",
}

type EmittedUser = {
  id: string;
  name: string;
};

io.on("connection", (socket) => {
  let myId: string = socket.id;

  socket.on(SocketEvent.CONNECT, (myName: string) => {
    manager.addUser(myId, myName);
    socket.emit(SocketEvent.CONNECT, myId);
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomType: string, roomId: string) => {
    const status = manager.join(roomType, roomId, myId);
    if (status) {
      const you: EmittedUser = { id: myId, name: manager.userName(myId) };
      socket.join(roomId);
      socket.to(roomId).emit(SocketEvent.USER_JOIN, you); // Broadcast to other users about your participation
    }
    socket.emit(SocketEvent.JOIN_ROOM, status);
  });

  socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
    manager.leave(roomId, myId);
    socket.to(roomId).emit(SocketEvent.USER_LEAVE, myId);  // Broadcast to other users about your leaving
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    const roomId = manager.currentRoomId(myId);
    if (roomId) {
      manager.leave(roomId, myId);
      manager.removeUser(myId);
      socket.to(roomId).emit(SocketEvent.USER_LEAVE, myId);
      socket.leave(roomId);
    }
  });

  socket.on(SocketEvent.GET_USERS, (roomId: string) => {
    const users: EmittedUser[] = manager.userIdsInRoom(roomId).map((userId) => ({ id: userId, name: manager.userName(userId) }));
    // .filter((userId) => userId !== myId)
    socket.emit(SocketEvent.GET_USERS, users);
  });

  socket.on(SocketEvent.CHANGE_NAME, (newUserName: string) => {
    manager.changeUserName(myId, newUserName);
    const roomId = manager.currentRoomId(myId);
    const you: EmittedUser = { id: myId, name: manager.userName(myId) };
    if (roomId) {
      socket.to(roomId).emit(SocketEvent.CHANGE_NAME, you);
    }
  });

  socket.onAny((event, data) => {
    if (!(event in Object.values(SocketEvent))) {
      const roomId = manager.currentRoomId(myId);
      if (roomId) {
        socket.to(roomId).emit(event, data);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
