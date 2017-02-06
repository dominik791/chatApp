'use strict';
let express = require('express');
let mkdirp = require('mkdirp');
let bodyParser = require('body-parser');
let config = require('./config');
let authRoutes = require('./routes/auth');
let roomRoutes = require('./routes/room');
let mongoose = require('mongoose');
let socketHandler = require('./socket-handler');
let loggedUsers = require('./usersInRooms');
let Room = require('./models/room.model');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

mongoose.connect('mongodb://admin:admin1!@ds161518.mlab.com:61518/chat');
mongoose.connection.once('open', () => {
  console.log('successfully connected to db');
});

app.use(express.static(config.staticPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/rooms', roomRoutes);

Room.find({}, (err, rooms) => {
  if (err) throw err;
  loggedUsers.generateRooms(rooms);
});

io.on('connection', (socket) => {
  socketHandler(io, socket);
});

http.listen(config.port);
console.log(`Listening on port ${config.port}`);
