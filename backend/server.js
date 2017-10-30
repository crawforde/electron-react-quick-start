const express = require('express');
const app = express();

// UNCOMMENT WHEN WE'RE READY TO START SETTING UP WEB SOCKETS
// require('./webSockets');

// Example route
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Backend server for Electron App running on port 3000!');
});
