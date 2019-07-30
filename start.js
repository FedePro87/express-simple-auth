require('dotenv').config();
const app = require('./app');

const server = app.listen(3000, () => {
  console.log(`Express is running on port ${server.address().port}`);
});

const io = require('socket.io').listen(server);

io.on('newuser', (user) => {
  console.log('new user registered',user)
});

io.on('connection', function(socket){
  socket.on('newuser', function(user){
    io.emit('newuser', user);
  });
});
