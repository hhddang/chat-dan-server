import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;

enum SocketEvent {
  SOCKET_ID = "SOCKET_ID",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  DATA = "DATA",
}

io.on("connection", (socket) => {
  socket.on(SocketEvent.SOCKET_ID, () => {
    socket.emit(SocketEvent.SOCKET_ID, socket.id);
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomId: string) => {
    socket.join(roomId);
  });

  socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on(SocketEvent.DATA, (roomId: string, key: string, data: unknown) => {
    socket.to(roomId).emit(SocketEvent.DATA, key, data);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
