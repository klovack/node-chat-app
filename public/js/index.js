/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
const socket = io();

// Show client that client is connected to server
socket.on('connect', function () {
  console.log('connected to server');
});

// Show client that server is down
socket.on('disconnect', function () {
  console.log('server is disconnected');
});

// Show messages to client
socket.on('newMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  let li = jQuery('<li></li>');

  if (message.from === 'Admin') {
    li = jQuery('<li id="admin"></li');
  }

  li.text(`${message.from} at ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});

// Listen for location information
socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const li = jQuery('<li></li>');
  const a = jQuery('<a target="_blank">My current location</a>');

  li.text(`${message.from} at ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

// Get the message form and emit the message to all clients
jQuery('#message-field').on('submit', function (e) {
  e.preventDefault();

  const messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextBox.val(),
  }, function () {
    messageTextBox.val('');
  });
});

// Grab the location of the user and emitting it to all clients
const btnSendLoc = jQuery('#send-location');
btnSendLoc.on('click', function () {
  // if navigator not supported
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  btnSendLoc.attr('disabled', 'disabled').text('Sending Location...');

  // get position from the navigator
  navigator.geolocation.getCurrentPosition(function (pos) {
    socket.emit('createLocMessage', {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    });
    setTimeout(() => {
      btnSendLoc.removeAttr('disabled').text('Send Location');
    }, 1500);
  }, function () {
    setTimeout(() => {
      btnSendLoc.removeAttr('disabled').text('Send Location');
    }, 1500);
    alert('Unable to fetch location.');
  });
});
