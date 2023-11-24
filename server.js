const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


const users = {};

app.use(express.static('public'));


io.on('connection', (socket) => {
  console.log('A user connected');

 
  socket.emit('request-name');


  socket.on('register-name', (name) => {
    users[socket.id] = name;
    io.emit('update-users', Object.values(users));
    console.log(`${name} (${socket.id}) has joined the chat.`);
  });

 
  socket.on('message', (message) => {
    const userName = users[socket.id];
   
    io.emit('message', { user: users[socket.id], message });
  });


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
