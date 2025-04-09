const io = require('socket.io')(3005, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on('joinRoomReactflow', (thisUser, room) => {
    if (!room || !thisUser) return;
    socket.join(room);
    rooms[room] = rooms[room] || { nodes: [], edges: [], orientation: 'TB', users: [] };
    rooms[room].users.push({ id: thisUser.id, name: thisUser.name, image: thisUser.image, pos: [0, 0] });
    socket.emit('reactflow', { ...rooms[room] });
  });

  const updateRoom = (room, key, data) => {
    if (!room || !rooms[room]) return;
    rooms[room][key] = data;
    io.to(room).emit(key, data);
  };

  socket.on('reactflow-nodes', (data, room) => updateRoom(room, 'nodes', data));
  socket.on('reactflow-edges', (data, room) => updateRoom(room, 'edges', data));
  socket.on('reactflow-orientation', (data, room) => updateRoom(room, 'orientation', data));
  socket.on('reactflow-users', (data, room) => {
    io.to(room).emit('reactflow-users', data);
    updateRoom(room, 'users', data);
  });

  socket.on('reactflow-nodes-changes', ({ userId = '', changes = [], nodes = [] }, room) => {
    if (!room || !rooms[room]) return;
    rooms[room].nodes = nodes;
    io.to(room).emit('reactflow-nodes-changes', { userId, changes });
  });

  socket.on('reactflow-disconected', (userId, room) => {
    if (!room || !rooms[room]) return;
    rooms[room].users = rooms[room].users.filter(user => user.id !== userId);
    io.to(room).emit('reactflow-users', rooms[room].users);
  });

  socket.on('message', (message, room) => { if (room) io.to(room).emit('message', message); });

  socket.on('disconnect', () => console.log('disconnected'));
});