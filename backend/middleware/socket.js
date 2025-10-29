// //

// import { getUsers, userJoin, userLeave } from "../utils/users.js";

// export default function socketHandler(io) {
//   io.on("connection", (socket) => {
//     socket.on("user-joined", (data) => {
//       const { roomId, userName, host, presenter } = data;
//       const user = userJoin(socket.id, userName, roomId, host, presenter);
//       const roomUsers = getUsers(user.room);

//       socket.join(user.room);

//       socket.emit("canvasImage", { imageURL: null }); // optional: send last snapshot
//       socket.emit("message", { message: "Welcome to Live Drawing Room" });
//       socket.broadcast
//         .to(user.room)
//         .emit("message", { message: `${user.username} has joined` });

//       io.to(user.room).emit("users", roomUsers);
//     });

//     socket.on("drawing", (data) => {
//       socket.to(data.roomId).emit("canvasImage", data.imageData);
//     });

//     socket.on("disconnect", () => {
//       const userLeaves = userLeave(socket.id);
//       if (!userLeaves) return;

//       const roomUsers = getUsers(userLeaves.room);
//       io.to(userLeaves.room).emit("message", {
//         message: `${userLeaves.username} left the room`,
//       });
//       io.to(userLeaves.room).emit("users", roomUsers);
//     });
//   });
// }

// middleware/socket.js
import { getUsers, userJoin, userLeave } from "../utils/users.js";

const throttle = (func, delay) => {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      func(...args);
    }
  };
};

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    /* ---------- join room ---------- */
    socket.on("user-joined", (data) => {
      const { roomId, userName, host, presenter } = data;
      const user = userJoin(socket.id, userName, roomId, host, presenter);
      const roomUsers = getUsers(user.room);

      socket.join(user.room);

      socket.emit("message", { message: "Welcome to Live Drawing Room" });
      socket.broadcast
        .to(user.room)
        .emit("message", { message: `${user.username} has joined` });

      io.to(user.room).emit("users", roomUsers);
    });

    /* ---------- live canvas stream ---------- */
    const throttledBroadcast = throttle(
      ({ roomId, imageData }) =>
        socket.to(roomId).emit("drawing", { imageURL: imageData }),
      150
    );

    socket.on("drawing", (data) => {
      if (!data.roomId) return;
      throttledBroadcast(data); // viewers receive  { imageURL: 'data:image/...' }
      // console.log(`This is backend side drawing`);
      // console.log(data);
      // console.log(data.roomId);
    });

    //Debug logs for backend drawing emit
    // socket.on("drawing", (data) => {
    //   if (!data?.roomId) {
    //     console.warn("[drawing] missing roomId, payload:", Object.keys(data));
    //     return;
    //   }
    //   throttledBroadcast(data);
    // });

    /* ---------- leave room ---------- */
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
