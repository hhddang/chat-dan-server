import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = 4000;

enum SocketEvent {
  JOIN_APP = "JOIN_APP",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  MESSAGE = "MESSAGE",
}

let roomIds: string[] = [];
const createRoomId = () => {
  let roomId = "";
  const length = 20;
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return roomId;
};

io.on("connection", (socket) => {
  const userId = socket.id;

  socket.on(SocketEvent.JOIN_APP, () => {
    socket.join("global");
    socket.emit(SocketEvent.JOIN_APP, userId);
    socket.to("global").emit(SocketEvent.JOIN_APP, userId);
  });

  socket.on(SocketEvent.CREATE_ROOM, () => {
    const roomId = createRoomId();
    roomIds.push(roomId);

    socket.join(roomId);
    socket.emit(SocketEvent.CREATE_ROOM, roomId);
  });

  socket.on(SocketEvent.JOIN_ROOM, (roomId: string) => {
    if (roomIds.includes(roomId)) {
      socket.join(roomId);
      socket.to(roomId).emit(SocketEvent.JOIN_ROOM, userId);

      // Emit userId to confirm
      socket.emit(SocketEvent.JOIN_ROOM, userId);
    }
  });

  socket.on(SocketEvent.LEAVE_ROOM, (roomId: string) => {
    if (roomIds.includes(roomId)) {
      socket.leave(roomId);
      socket.to(roomId).emit(SocketEvent.LEAVE_ROOM, userId);

      // Emit userId to confirm
      socket.emit(SocketEvent.LEAVE_ROOM, userId);
    }
  });

  socket.on(SocketEvent.MESSAGE, (message: string, roomId?: string) => {
    if (roomId) {
      socket.to(roomId).emit(SocketEvent.MESSAGE, message, userId);
    } else {
      socket.broadcast.emit(SocketEvent.MESSAGE, message, userId);
    }
  });
});

io.of("/").adapter.on("delete-room", (roomId: string) => {
  if (roomIds.includes(roomId)) {
    roomIds = roomIds.filter((id) => id !== roomId);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
