const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());

const io = require('socket.io')(5001, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  // socket creates a new id everytime you enter, so we want to
  // join it with the user id that we have, which is static
  // query.id comes from SocketProvider useEffect
  const id = socket.handshake.query.id;
  socket.join(id);

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      });
    });
  });
});
