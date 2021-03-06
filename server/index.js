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

mongoose.connect(config.mongoDB_URI);
mongoose.connection.once('open', () => {
  console.log('successfully connected to db');
});

app.use(express.static(config.staticPath));
app.use(bodyParser.urlencoded({ extended: true, limit: config.maxRequestSize }));
app.use(bodyParser.json({ limit: config.maxRequestSize }));

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
