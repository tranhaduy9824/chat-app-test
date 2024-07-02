// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://chat-app-test-1.onrender.com/',
    // origin: 'http://localhost:5000',
    methods: ['GET', 'POST'],
  },
});

let onlineUsers = [];

io.on('connection', (socket) => {
  console.log('New connection', socket.id);

  // Listen to a connection
  socket.on('addNewUser', (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log('onlineUsers', onlineUsers);

    io.emit('getOnlineUsers', onlineUsers);
  });

  socket.on('sendMessage', (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );

    if (user) {
      io.to(user.socketId).emit('getMessage', message);
      io.to(user.socketId).emit('getNotifications', {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit('getOnlineUsers', onlineUsers);
  });
});

const socketPort = 3000;
io.listen(socketPort);

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

const currentDirectory = path.resolve();
app.use(express.static(path.join(currentDirectory, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(currentDirectory, 'client', 'dist', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('Welcome our chat APIs...');
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

server.listen(port, (req, res) => {
  console.log(`Server running on port: ${port}`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connection established'))
  .catch((err) => console.log('MongoDB connection failed: ', err.message));