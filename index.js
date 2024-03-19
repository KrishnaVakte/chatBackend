const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userroute = require("./routes/userroute");
const messageroute = require("./routes/messageroute");

const app = express();
const socket = require("socket.io")
require("dotenv").config();

app.use(cors({
  origin: '*',
  credentials:true,
}));
app.use(express.json());
app.use((req, res, next) => {
  //allow access from every, elminate CORS
  res.setHeader('Access-Control-Allow-Origin','*');
  res.removeHeader('x-powered-by');
  //set the allowed HTTP methods to be requested
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  //allow request to continue and be handled by routes
  next();
});

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
    origin:"*",
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
