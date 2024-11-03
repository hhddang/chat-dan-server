import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;
let currentRoomId: string | null = null;

enum SocketEvent {
  CONNECT = "CONNECT",
  DISCONNECT = "DISCONNECT",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  DATA = "DATA",
}

io.on("connection", (socket) => {
  socket.on("connect", () => {
    socket.emit(SocketEvent.CONNECT, socket.id);
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

  socket.on("disconnect", () => {
    if (currentRoomId) {
      socket.to(currentRoomId).emit(SocketEvent.DISCONNECT, socket.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
