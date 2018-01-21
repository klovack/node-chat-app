/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
const socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('disconnect', function () {
  console.log('server is disconnected');
});

socket.on('new message', function (message) {
  console.log('new message', message);
});

socket.emit('create message', {
  from: 'rizki',
  text: 'Hey rizki',
});
