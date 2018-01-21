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

  socket.emit('newMessage', {
    from: 'rizki',
    text: 'Hallo',
    createdAt: 123,
  });

  socket.on('createMessage', (newMessage) => {
    console.log('Create message', newMessage);
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
