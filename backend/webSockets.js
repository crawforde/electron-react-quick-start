const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  socket.on('username', (username) => {
    if (!username || !username.trim()) {
      return socket.emit('errorMessage', 'No username!');
    }
    socket.username = String(username);
  });

  socket.on('room', requestedRoom => {
    if (!socket.username) {
      return socket.emit('errorMessage', 'Username not set!');
    }
    if (!requestedRoom) {
      return socket.emit('errorMessage', 'No room!');
    }
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.room = requestedRoom;
    socket.join(requestedRoom, () => {
      socket.to(requestedRoom).emit('message', {
        username: 'System',
        content: `${socket.username} has joined`
      });
    });
  });

  socket.on('edit', editData =>{
    socket.to(editData.roomName).emit('edit',editData);
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
  console.log(`listening on port ${port}`);
});
