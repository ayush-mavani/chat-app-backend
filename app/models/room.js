const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomName: String,
    userName: String,
    socketId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("room", roomSchema);
