const express = require("express");
const app = express();
const cors = require("cors");
const connect = require("./app/config/database");
const env = require("./app/config/env");
const Room = require("./app/models/room");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  return res.json({ status: true, message: "Chat App..." });
});

app.post("/room/:roomName/note", async (req, res) => {
  try {
    console.log("room node...", req.body, req.params);

    const { content } = req.body;
    const { roomName } = req.params;

    await Room.findOneAndUpdate({ roomName }, { content });

    return res.json({ status: true, message: "Note Updated!" });
  } catch (err) {
    console.log("rooom note error...", err);
    return res.json({ status: false, message: "Server Error!" });
  }
});

app.get("/room/:roomName", async (req, res) => {
  try {
    console.log("room...", req.params);

    const { roomName } = req.params;

    let room = await Room.findOne({ roomName });

    if (!room) {
      room = await new Room({ roomName, content: "" }).save();
    }

    return res.json({ status: true, message: "Room Created!", data: room });
  } catch (err) {
    console.log("room error...", err);
    return res.json({ status: false, message: "Server Error!" });
  }
});

connect(env.DB_CONNECTION_STRING)
  .then(async () => {
    console.log("Database connected!");
  })
  .catch((err) => {
    console.log("Error connecting...", err.message);
  });

const Http = require("http").createServer(app);
const socket = require("./app/socket/socket");
socket(Http);

module.exports = { Http };
