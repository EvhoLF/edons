// eslint-disable-next-line @typescript-eslint/no-require-imports
const io = require('socket.io')(3005, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

// const UserInitial = { id: '', name: '', image: '', pos: [0, 0] }

const rooms = {};
io.on("connection", (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
  });
  socket.on('joinRoomReactflow', (thisUser, room) => {
    if (!room || !thisUser) return;
    socket.join(room);
    rooms[room] = rooms[room] || { nodes: [], edges: [], orientation: 'TB', users: [] };
    rooms[room].users.push({ id: thisUser.id, name: thisUser.name, image: thisUser.image, pos: [0, 0] });
    socket.emit('reactflow', { ...rooms[room] });
  });
  socket.on('reactflow-nodes', (data, room) => {
    if (!room || !rooms[room]) return;
    rooms[room]['nodes'] = data;
    io.to(room).emit('reactflow-nodes', data);
  });
  socket.on('reactflow-edges', (data, room) => {
    if (!room || !rooms[room]) return;
    rooms[room]['edges'] = data;
    io.to(room).emit('reactflow-edges', data);
  });
  socket.on('reactflow-orientation', (data, room) => {
    if (!room || !rooms[room]) return;
    rooms[room]['orientation'] = data;
    io.to(room).emit('reactflow-orientation', data);
  });
  socket.on('reactflow-users', (data, room) => {
    if (!room || !rooms[room]) return;
    rooms[room]['users'] = data;
    io.to(room).emit('reactflow-users', data);
  });
  socket.on('reactflow-disconected', (res, room) => {
    if (rooms[room]?.users && rooms[room].users.length) {
      rooms[room].users = rooms[room].users.filter(user => user.id !== res);
      io.to(room).emit('reactflow-users', rooms[room].users);
    }
  })
  socket.on('message', (message, room) => {
    if (room) io.to(room).emit('message', message);
  });

  socket.on('disconected', () => { console.log('disconected'); })
});