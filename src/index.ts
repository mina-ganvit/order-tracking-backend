console.log("Hellooo i am hre");
import express from "express";
import mongoose from "mongoose";

import redis from "./utils/redis";

import router from "./routes";
require("dotenv").config();

import { Server } from "socket.io";
import http from "http";
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
import path from "path";

mongoose
  .connect(`${process.env.DB_HOST_URL}${process.env.DB_NAME}`)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("==============>Error", error);
  });

redis
  .connect()
  .then(() => console.log("Redis connected"))
  .catch((error) => console.log(error));

const io = new Server(server, {
  cors: { origin: "*" },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

server.listen(port, () => {
  console.log(`Port listning on ${port}`);
});
