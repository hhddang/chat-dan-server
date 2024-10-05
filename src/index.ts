import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;

enum SocketEvent {
  JOIN_APP = "JOIN_APP",
  USER_ID = "USER_ID",
  SEND_MESSAGE = "SEND_MESSAGE",
  RECEIVE_MESSAGE = "RECEIVE_MESSAGE",
}

io.on("connection", (socket) => {
  socket.on(SocketEvent.JOIN_APP, () => {
    socket.emit(SocketEvent.USER_ID, socket.id);
  });

  socket.on(SocketEvent.SEND_MESSAGE, (message: string) => {
    socket.broadcast.emit(SocketEvent.RECEIVE_MESSAGE, message);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
