let io;
const Room = require("../models/room");

module.exports = (server) => {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
      credentials: true,
    },
    allowEI03: true,
  });

  io.on("connection", async (socket) => {
    socket.on("join", async ({ roomName, userName }) => {
      try {
        const userExists = await Room.findOne({ roomName, userName });
        console.log("userExists::: ", userExists);

        if (userExists) {
          socket.emit("error", {
            status: false,
            message: "Username already taken in this room",
          });
        } else {
          await new Room({
            roomName,
            userName,
            socketId: socket.id,
          }).save();
          socket.join(roomName);

          socket
            .to(roomName)
            .emit("user-joined", `${userName} has joined room`);

          socket.broadcast.emit("getUsersInRoom", "world");
        }
      } catch (err) {
        console.log("join err...");
      }
    });

    socket.on("note-update", async ({ roomName, content }) => {
      try {
        console.log("not-update...", roomName, content);
        socket.to(roomName).emit("received-note", content);
      } catch (err) {
        console.log("not-updated err...", err.message);
      }
    });

    socket.on("typing", async ({ roomName, userName }) => {
      try {
        console.log("typing...", roomName, userName);
        socket.to(roomName).emit("user-typing", userName);
      } catch (err) {
        console.log("typing err...", err.message);
      }
    });

    socket.on("disconnecting", async () => {
      const id = socket.id;
      const left_User = await Room.findOne({ socketId: id });
      if (left_User) {
        console.log("left_User::: ", left_User);
        socket
          .to(left_User?.roomName)
          .emit("leave-room", `${left_User?.userName} is left room`);
        await Room.findOneAndDelete({ socketId: id });
      }
    });
  });
};
