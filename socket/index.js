const { Server } = require("socket.io");
const findPort = require('find-port');

let onlineUsers = [];

function startServer() {
  findPort(10000, 10100, (err, ports) => {
    if (err) {
      console.error(err);
      return;
    }

    const port = ports[0];
    const io = new Server({
      cors: {
        origin: "https://chat-app-test-1sr1.onrender.com",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New connection", socket.id);

      socket.on("addNewUser", (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
          onlineUsers.push({
            userId,
            socketId: socket.id,
          });

        console.log("onlineUsers", onlineUsers);

        io.emit("getOnlineUsers", onlineUsers);
      });

      socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(
          (user) => user.userId === message.recipientId
        );

        if (user) {
          io.to(user.socketId).emit("getMessage", message);
          io.to(user.socketId).emit("getNotifications", {
            senderId: message.senderId,
            isRead: false,
            date: new Date(),
          });
        }
      });

      socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

        io.emit("getOnlineUsers", onlineUsers);
      });
    });

    io.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${err.port} is already in use`);
        startServer(); // Retry with a different port
      } else {
        console.error(err);
      }
    });

    io.listen(port);
    console.log(`Server listening on port ${port}`);
  });
}

startServer();