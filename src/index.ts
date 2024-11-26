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
  GET_ID = "GET_ID",
  USER_DISCONNECT = "USER_DISCONNECT",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  DATA = "DATA",
}

io.on("connection", (socket) => {
  let currentRoomId: string | null = null;

  socket.on(SocketEvent.GET_ID, () => {
    const userId = manager.joinApp();
    socket.emit(SocketEvent.GET_ID, userId);
  });

  socket.on("disconnect", () => {
    if (currentRoomId) {
      socket.to(currentRoomId).emit(SocketEvent.USER_DISCONNECT, socket.id);
    }
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomId: string) => {
    currentRoomId = roomId;
    socket.join(roomId);
  });

  socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
    currentRoomId = null;
    socket.leave(roomId);
  });

  socket.on(SocketEvent.DATA, (id: string, key: string, data: unknown) => {
    socket.to(id).emit(SocketEvent.DATA, key, data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
