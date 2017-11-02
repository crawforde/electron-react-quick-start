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
  socket.on('username', username => {
    if (!username) {
      return socket.emit('errorMessage', 'No username!');
    }
    socket.username = String(username);
  });

  socket.on('document', requestedRoom => {
    if (!requestedRoom) {
      return socket.emit('errorMessage', 'No room!');
    }
    if (socket.document) {
      socket.leave(socket.document);
    }
    socket.document = requestedRoom;
    socket.join(requestedRoom, () => {
      socket.to(requestedRoom).emit('joined', {
        username: socket.username,
        content: `${socket.username} has joined`
      });
    });
  });

<<<<<<< HEAD
  socket.on('docUpdate', editData => {
    socket.to(socket.document).emit('docUpdate', editData);
=======
  socket.on('docUpdate', editData =>{
    socket.to(socket.document).emit('docUpdate','Document Updated');
    // socket.to(socket.document).broadcast('docUpdate', editData);
>>>>>>> e0aafa1176e1acc060d6dbc4a8e00eebd1c4b17e
  });

  socket.on('message', (message) => {
    if (!socket.room) {
      return socket.emit('errorMessage', 'No rooms joined!');
    }
    socket.to(socket.room).emit('message', {
      username: message.username,
      content: message.content
    });
  });
});

const port = 4390;
server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});
