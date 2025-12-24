const socket = io();
const editor = document.getElementById("editor");

// Get room ID from URL
const roomId = window.location.pathname.substring(1) || "default";

// Join the room
socket.emit("join-room", roomId);

// Send text changes
editor.addEventListener("input", () => {
  socket.emit("text-change", {
    roomId,
    text: editor.value
  });
});

// Receive updates from other users (real-time)
socket.on("update-text", (text) => {
  editor.value = text;
});
