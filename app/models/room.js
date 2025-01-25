const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomName: String,
    content: String,
  },
  { timestamps: true }
);

const Room = mongoose.model("room", roomSchema);
module.exports = Room;
