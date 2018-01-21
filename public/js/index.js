/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
const socket = io();

socket.on('connect', function () {
  console.log('connected to server');
});

socket.on('disconnect', function () {
  console.log('server is disconnected');
});

socket.on('newMessage', function (message) {
  console.log('new message', message);
});
