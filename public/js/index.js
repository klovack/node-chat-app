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
  const li = jQuery('<li></li>');

  li.text(`${message.from}: ${message.text}`);

  jQuery('#messages').append(li);
});

jQuery('#message-field').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val(),
  }, function () {
    console.log('okay');
  });
});
