const mongoose = require("mongoose");

const getSocketUsers = (userArray, value) => {
  return userArray.filter((roomName) => roomName.roomName === value);
};

let io;
module.exports = (server) => {
  const app_user = [];
  console.log("socket...");

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
    console.log("socket connect...");

    socket.on("join", async ({ roomName }) => {
      try {
        console.log("join...", roomName);

        app_user.push({ roomName, socketId: socket.id });

        socket.join(roomName);
        console.log("roomName...", roomName, socket.id);

        socket.emit("user-joined", socket.id);
        socket.broadcast.emit("user-joined", socket.id);
      } catch (err) {
        console.log("join err...");
      }
    });

    socket.on("note-update", async ({ roomName, content }) => {
      try {
        console.log("not-update...", roomName, content);

        const getALlSocketUser = getSocketUsers(app_user, roomName);

        for (let i = 0; i < getALlSocketUser.length; i++) {
          io.to(getALlSocketUser[i].socketId).emit("received-note", content);
        }
      } catch (err) {
        console.log("not-updated err...", err.message);
      }
    });

    socket.on("typing", async ({ roomName, userName }) => {
      try {
        console.log("typing...", roomName, userName);

        const getALlSocketUser = getSocketUsers(app_user, roomName);
        console.log("getALlSocketUser...", getALlSocketUser);

        for (let i = 0; i < getALlSocketUser.length; i++) {
          io.to(getALlSocketUser[i].socketId).emit("user-typing", userName);
        }
      } catch (err) {
        console.log("typing err...", err.message);
      }
    });

    // socket.disconnect((data) => {
    //   console.log("disconnect...", data);
    // });
  });
};
