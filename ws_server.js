// ws_server.js
const io = require('socket.io')(3005, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});

const rooms = {};

io.on('connection', socket => {
  // Вспомогательная функция для удаления пользователя
  const removeUser = (userId, room) => {
    const r = rooms[room];
    if (!r) return;
    r.users = r.users.filter(u => u.id !== userId);
    if (r.users.length === 0) {
      // если никого не осталось — чистим память
      delete rooms[room];
    } else {
      io.to(room).emit('reactflow-users', r.users);
    }
  };

  socket.on('joinRoomReactflow', (thisUser, room) => {
    if (!room || !thisUser) return;

    // проверяем, есть ли в комнате хоть один пользователь ДО нашего присоединения
    const exists = rooms[room] && rooms[room].users.length > 0;

    // присоединяемся к комнате
    socket.join(room);
    // сохраняем привязку для обработки disconnect
    socket.data.room = room;
    socket.data.userId = thisUser.id;

    // если комнаты ещё не было — инициализируем
    if (!rooms[room]) {
      rooms[room] = {
        nodes: [], edges: [], orientation: 'TB',
        users: [], codeData: []
      };
    }

    // отправляем новому сокету текущее состояние + флаг hasRoom
    socket.emit('reactflow', {
      ...rooms[room],
      hasRoom: exists
    });

    const userList = rooms[room].users;
    const existing = userList.find(u => u.id === thisUser.id);

    if (existing) {
      // обновляем поля у существующего
      existing.name = thisUser.name;
      existing.image = thisUser.image;
      // при желании можно сбросить позицию:
      // existing.pos   = [0, 0];
    } else {
      // добавляем нового
      userList.push({
        id: thisUser.id,
        name: thisUser.name,
        image: thisUser.image,
        pos: [0, 0]
      });
    }

    // рассылаем всем в комнате обновлённый список пользователей
    io.to(room).emit('reactflow-users', userList);
  });

  const updateRoom = (room, key, data) => {
    if (!room || !rooms[room]) return;
    rooms[room][key] = data;
    // если кодовые данные — используем отдельный эвент
    const event = key === 'codeData' ? 'reactflow-codedata' : `reactflow-${key}`;
    io.to(room).emit(event, data);
  };

  socket.on('reactflow-nodes', (data, room) => updateRoom(room, 'nodes', data));
  socket.on('reactflow-edges', (data, room) => updateRoom(room, 'edges', data));
  socket.on('reactflow-orientation', (data, room) => updateRoom(room, 'orientation', data));
  socket.on('reactflow-codedata', (data, room) => updateRoom(room, 'codeData', data));

  socket.on('reactflow-nodes-changes', ({ userId = '', changes = [] }, room) => {
    if (!room || !rooms[room]) return;
    io.to(room).emit('reactflow-nodes-changes', { userId, changes });
  });

  // когда клиент сам просит обновить список (например, обновил свою позицию)
  socket.on('reactflow-users', (data, room) => {
    if (!room || !rooms[room]) return;
    rooms[room].users = data;
    io.to(room).emit('reactflow-users', data);
  });

  // наш собственный эвент «пользователь вышел»
  socket.on('reactflow-disconected', (userId, room) => {
    removeUser(userId, room);
  });

  // а если просто оборвалось соединение
  socket.on('disconnect', () => {
    const { userId, room } = socket.data;
    if (userId && room) removeUser(userId, room);
  });

  socket.on('message', (message, room) => {
    if (room) io.to(room).emit('message', message);
  });
});
