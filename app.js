const express = require("express");
const app = express();
const path = require("path");

const http = require("http").Server(app);

const port = process.env.PORT || 8080;

const io = require("socket.io")(http);

global.subscribersSet = new Set();

io.on("connection", (socket) => {
  console.log("Connected to server " + socket.id);
  socket.on("disconnect", () => {
    console.log("Disconnectd ");
  });
  socket.on("send-message", async (data) => {
    const emitError = (error) => {
      socket.emit("send-message", {
        type: "Error",
        error: error,
        updatedAt: Date.now(),
      });
    };

    try {
      var jsonData = JSON.parse(data);
    } catch (err) {
      emitError("Bad formatted payload, non JSON");
      return;
    }
    const emitSubscribe = () => {
      subscribersSet.add(socket.id);
      socket.emit("send-message", {
        type: "Subscribe",
        status: "Subscribed",
        updatedAt: Date.now(),
      });
    };
    const emitUnsubscribe = () => {
      socket.delete(socket.id);
      socket.emit("send-message", {
        type: "Unsubscribe",
        status: "Unsubscribed",
        updatedAt: Date.now(),
      });
    };
    const countSubscribersEmit = () => {
      subscribersSet.delete(socket.id);
      socket.emit("send-message", {
        type: "CountSubscribers",
        count: subscribersSet.size,
        updatedAt: Date.now(),
      });
    };

    if (jsonData.type === "Subscribe") {
      setTimeout(emitSubscribe, 4000);
    } else if (jsonData.type === "Unsubscribe") {
      setTimeout(emitUnsubscribe, 8000);
    } else if (jsonData.type === "CountSubscribers") {
      countSubscribersEmit();
    } else {
      emitError("Requested method not implemented");
    }
  });
});

setInterval(() => {
  data = { type: "Heartbeat", updatedAt: Date.now() };
  io.emit("heart-beat", data);
}, 1000);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src/index.html"));
});
http.listen(port, () => {
  console.log("App is running on port " + port);
});

module.exports = http;
