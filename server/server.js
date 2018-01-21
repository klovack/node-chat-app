const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routes'));

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });

  // Add join emit
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime(),
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New User Joined',
    createdAt: new Date().getTime(),
  });

  socket.on('createMessage', (newMessage) => {
    io.emit('newMessage', {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: new Date().getTime(),
    });

    // socket.broadcast.emit('newMessage', {
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime(),
    // });
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
