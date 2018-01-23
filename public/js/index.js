/* eslint prefer-arrow-callback: 0 */
/* eslint func-names: 0 */
const socket = io();

const scrollToBottom = () => {
  const objDiv = jQuery('.chat-messages');
  const messages = jQuery('#messages');
  objDiv.scrollTop(messages.height());
};

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
  if (message.text !== '') {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime,
    });

    jQuery('#messages').append(html);
    scrollToBottom();
  }
});

// Listen for location information
socket.on('newLocationMessage', function (message) {
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime,
  });

  jQuery('#messages').append(html);
  scrollToBottom();
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
