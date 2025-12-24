const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// In-memory storage for room texts
const roomTexts = {};

app.use(express.static("public"));

// Express 5 compatible catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Send saved text (if exists)
    if (roomTexts[roomId]) {
      socket.emit("update-text", roomTexts[roomId]);
    }
  });

  // Handle text changes
  socket.on("text-change", ({ roomId, text }) => {
    roomTexts[roomId] = text;

    // Send update ONLY to other users in the room
    socket.to(roomId).emit("update-text", text);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
