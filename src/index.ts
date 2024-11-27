import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Manager } from "room";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;
const manager = new Manager();

enum SocketEvent {
  JOIN_APP = "SK_JOIN_APP",
  LEAVE_APP = "SK_LEAVE_APP",
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

  // socket.on(SocketEvent.JOIN_ROOM, (roomId: string) => {
  //   currentRoomId = roomId;
  //   socket.join(roomId);
  // });

  // socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
  //   currentRoomId = null;
  //   socket.leave(roomId);
  // });

  // socket.on(SocketEvent.DATA, (id: string, key: string, data: unknown) => {
  //   socket.to(id).emit(SocketEvent.DATA, key, data);
  // });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
