const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

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
  socket.emit(
    'newMessage',
    generateMessage('Admin', 'Welcome to cakap'),
  );

  socket.broadcast.emit(
    'newMessage',
    generateMessage('Admin', 'New user joined'),
  );

  socket.on('createMessage', (newMessage, callback) => {
    io.emit(
      'newMessage',
      generateMessage(newMessage.from, newMessage.text),
    );

    callback(null, 'message sent');
  });

  socket.on('createLocMessage', (coords) => {
    io.emit(
      'newLocationMessage', 
      generateLocationMessage('User', coords.latitude, coords.longitude)
    );
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
