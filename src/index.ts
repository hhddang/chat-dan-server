import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;

io.on("connection", (socket) => {
  socket.emit("user-id", socket.id);

  socket.on("join", (userId: string) => {
    socket.broadcast.emit("new-user", userId);

    socket.on("leave", () => {
      socket.broadcast.emit("user-leave", userId);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
