const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userroute = require("./routes/userroute");
const messageroute = require("./routes/messageroute");

const app = express();
const socket = require("socket.io")
require("dotenv").config();

app.use(cors({
  origin: 'https://chat-front-khaki.vercel.app/',
}));
app.use(express.json());

app.use("/api", userroute);
app.use("/api", messageroute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected successfully !!!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`server is listening on port:${port}`);
});

app.get('/', (req, res) => {
  res.send("app running...")
})

const io = socket(server , {
  cors:{
    origin:"http://localhost:3000",
    credentials:true,
  },
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
