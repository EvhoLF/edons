
// eslint-disable-next-line @typescript-eslint/no-require-imports
const io = require('socket.io')(3005, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const activeUsers = new Set();

io.on("connection", (socket) => {
  const userId = socket.id;

  if (!activeUsers.has(userId)) {
    activeUsers.add(userId);
    console.log(`User Connected: ${activeUsers.size}`);
    io.emit("updateUsers", activeUsers.size);
  }

  const removeUser = () => {
    if (activeUsers.has(userId)) {
      activeUsers.delete(userId);
      console.log(`User Disconnected: ${activeUsers.size}`);
      io.emit("updateUsers", activeUsers.size);
    }
  };

  socket.on('disconnect', removeUser);
  socket.on('exit', removeUser); // Обрабатываем явный выход пользователя
});


// socket.on('message', (message, roomName) => {
//   if (roomName.length) {
//     io.to(roomName).emit('message', message);
//     console.log(`roomName: ${roomName}; message: ${message}`);
//   }
// })

// socket.on('joinRoom', (roomName) => {
//   console.log('User join ' + roomName);
//   socket.join(roomName)
// })