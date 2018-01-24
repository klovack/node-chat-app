const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routes'));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    // Add join emit
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to cakap'),
    );

    socket.broadcast.to(params.room).emit(
      'newMessage',
      generateMessage('Admin', `${params.name} has joined`),
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });

  socket.on('createMessage', (newMessage, callback) => {
    const user = users.getUser(socket.id);

    if (user && isRealString(newMessage.text)) {
      io.to(user.room).emit(
        'newMessage',
        generateMessage(user.name, newMessage.text),
      );
    }

    callback(null, 'message sent');
  });

  socket.on('createLocMessage', (coords) => {
    const user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'newLocationMessage',
        generateLocationMessage(user.name, coords.latitude, coords.longitude),
      );
    }

  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
