import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const PORT = 3001;

// User Story 1: Create HTTP server reading ./public/index.html
const server = http.createServer((req, res) => {
  fs.readFile('./public/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    // Responds with status 200 and Content-Type: text/html
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
});

// User Story 2: Create WebSocketServer from ws package
const wss = new WebSocketServer({ server });

// Helper function to broadcast to all connected clients
const broadcast = (messageObj) => {
  const messageString = JSON.stringify(messageObj);
  wss.clients.forEach(client => {
    // Check if the client's connection is open (readyState 1 === WebSocket.OPEN)
    if (client.readyState === 1) {
      client.send(messageString);
    }
  });
};

// User Story 3: Register 'connection' listener on wss
wss.on('connection', (socket, req) => {
  
  // User Story 4: Parse username from URL query string
  const username = new URL(req.url, "http://localhost").searchParams.get("username");
  
  // Immediately broadcast system message to all connected clients
  broadcast({ type: "system", text: `${username} joined` });

  // User Story 5: Register 'message' listener on socket
  socket.on('message', (message) => {
    try {
      const { username, text } = JSON.parse(message);
      // Broadcast chat message to all connected clients (including sender)
      broadcast({ type: 'chat', username, text });
    } catch (err) {
      console.error("Invalid JSON received:", err);
    }
  });

  // User Story 6: Register 'close' listener on socket
  socket.on('close', () => {
    // Broadcast system message to all remaining connected clients
    broadcast({ type: 'system', text: `${username} left` });
  });
});

// User Story 7: Start the server and log the exact specified string
server.listen(PORT, () => {
  console.log('Chat server running at http://localhost:3001');
});
