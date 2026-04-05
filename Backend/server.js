import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils.js";

// create websocket server
const wss = new WebSocketServer({ port: 1234 });

wss.on("connection", (conn, req) => {
  console.log("✅ Client connected");

  setupWSConnection(conn, req);

  conn.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

console.log("🚀 Server running at ws://localhost:1234");