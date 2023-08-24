const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const users = {};
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Ask the user for their name
  socket.emit('request-name');

  // Handle user registration with a name
  socket.on('register-name', (name) => {
    users[socket.id] = name;
    io.emit('update-users', Object.values(users));
    console.log(`${name} (${socket.id}) has joined the chat.`);
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    const userName = users[socket.id];
    //io.emit('message', { user: userName, message }); // Send both user and message
    io.emit('message', { user: users[socket.id], message });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const disconnectedUser = users[socket.id];
    delete users[socket.id];
    io.emit('update-users', Object.values(users));
    console.log(`${disconnectedUser} (${socket.id}) has left the chat.`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
