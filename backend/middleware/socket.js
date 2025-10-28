import { getUsers, userJoin, userLeave } from "../utils/users.js";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    socket.on("user-joined", (data) => {
      const { roomId, userName, host, presenter } = data;
      const user = userJoin(socket.id, userName, roomId, host, presenter);
      const roomUsers = getUsers(user.room);

      socket.join(user.room);

      socket.emit("canvasImage", { imageURL: null }); // or last snapshot
      socket.emit("message", { message: "Welcome to Live Drawing Room" });
      socket.broadcast
        .to(user.room)
        .emit("message", { message: `${user.username} has joined` });

      io.to(user.room).emit("users", roomUsers);
    });

    socket.on("drawing", (data) => {
      // data = { roomId, imageData }
      socket.to(data.roomId).emit("canvasImage", data.imageData);
    });

    socket.on("disconnect", () => {
      const userLeaves = userLeave(socket.id);
      if (!userLeaves) return;

      const roomUsers = getUsers(userLeaves.room);
      io.to(userLeaves.room).emit("message", {
        message: `${userLeaves.username} left the room`,
      });
      io.to(userLeaves.room).emit("users", roomUsers);
    });
  });
}
