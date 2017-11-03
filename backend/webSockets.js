
module.exports = function (app) {

  const io = require('socket.io')(app);

  io.on('connection', socket => {

    function NumOfClients(docId){
      let clients = io.nsps['/'].adapter.rooms[docId];
      return (clients) ? clients.length : 0;
    }

    socket.on('leaveDoc', (requestedRoom) => {
      if(requestedRoom.docId){
        socket.to(requestedRoom.docId).emit('userLeft', requestedRoom.username);
        socket.leave(requestedRoom.docId);
      }
    });

    socket.on('document', (requestedRoom) => {
      if (!requestedRoom.docId) {
        return socket.emit('errorMessage', 'No room!');
      }
      socket.document = requestedRoom.docId;
      socket.username = requestedRoom.username;
      if(NumOfClients(requestedRoom.docId) < 6){
        socket.join(requestedRoom.docId, () => {
          socket.to(requestedRoom.docId).emit('joined', requestedRoom.username);
        });
      } else {
        socket.emit('failedToJoin', requestedRoom);
      }
    });

    socket.on('liveVersionResponse', ({content, socketId}) => {
      socket.to(socketId).emit('liveVersionResponse', content);
    });

    socket.on('liveVersionRequest', () => {
      socket.to(socket.document).emit('liveVersionRequest', socket.id);
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

};

// const port = 4390;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}!`);
// });
