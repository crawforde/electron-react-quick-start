const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


io.on('connection', socket => {
  socket.on('test', (test) => {
    if (test) {
      return socket.emit('testsuccess', 'Yay!');
    }
  });
  socket.on('document', (requestedRoom) => {
    socket.document = requestedRoom.docId;
    socket.username = requestedRoom.username;
    if (!requestedRoom.docId) {
      return socket.emit('errorMessage', 'No room!');
    }
    if (socket.document === requestedRoom.docId) {
      socket.leave(socket.document);
    }
    socket.join(requestedRoom.docId, () => {
      socket.to(requestedRoom.docId).emit('joined', socket.username);
    });
  });

  socket.on('docUpdate', (changes) =>{
    socket.to(socket.document).emit('docUpdate', changes);
  });

  socket.on('saving', () => {
    socket.to(socket.document).emit('saving');
  });

  socket.on('doneSaving', version => {
    socket.to(socket.document).emit('doneSaving', version);
  });
});

const port = 4390;
server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
