import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Manager, RoomType } from "room";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;
const manager = new Manager();

enum SocketEvent {
  JOIN_APP = "SK_JOIN_APP",
  LEAVE_APP = "SK_LEAVE_APP",
  CREATE_ROOM = "SK_CREATE_ROOM",
  // DELETE_ROOM = "SK_DELETE_ROOM",
  JOIN_ROOM = "SK_JOIN_ROOM",
  LEAVE_ROOM = "SK_LEAVE_ROOM",
}

io.on("connection", (socket) => {
  let userId = manager.joinApp();

  socket.on(SocketEvent.JOIN_APP, () => {
    socket.emit(SocketEvent.JOIN_APP, userId);
  });

  socket.on("disconnect", () => {
    const roomId = manager.getRoomId(userId);
    if (roomId) {
      socket.to(roomId).emit(SocketEvent.LEAVE_APP, socket.id);
    }
  });

  socket.on(SocketEvent.CREATE_ROOM, (roomType: RoomType) => {
    const roomId = manager.createRoom(roomType);
    socket.emit(SocketEvent.CREATE_ROOM, roomId);
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomId: string) => {
    manager.joinRoom(roomId, userId);
  });

  socket.on(SocketEvent.LEAVE_ROOM, () => {
    const roomId = manager.getRoomId(userId);
    if (roomId) {
      const userIds = manager.getUserIds(roomId);
      manager.leaveRoom(userId);
      if (userIds.length <= 0) {
        manager.deleteRoom(roomId);
      }
    }
  });

  // socket.on(SocketEvent.DATA, (id: string, key: string, data: unknown) => {
  //   socket.to(id).emit(SocketEvent.DATA, key, data);
  // });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
