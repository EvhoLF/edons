import { IUser } from '@/DB/models/User';
import { applyEdgeChanges, applyNodeChanges, useEdgesState, useNodesState } from '@xyflow/react';
import { DefaultUser } from 'next-auth';
import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface useSyncedFlow {
  isPublicAccess: boolean;
  serverUrl: string;
  room: string;
  thisUser?: DefaultUser & IUser;
}

interface Users {
  id: string,
  name: string,
  image: string,
  pos: [number, number],
}

export const useSyncedFlow = ({ thisUser, isPublicAccess = false, room, serverUrl = 'http://localhost:3005' }: useSyncedFlow) => {
  const [hasRoom, setHasRoom] = useState(false);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [orientation, setOrientation] = useState('TB');
  const [users, setUsers] = useState<Users[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isPublicAccess) return;
    const sock = io(serverUrl);
    const handleBeforeUnload = () => { sock.emit('reactflow-disconected', thisUser.id, room); };
    sock.emit('joinRoomReactflow', thisUser, room);
    sock.on('reactflow', (e) => { if (e) { setNodes(e.nodes); setEdges(e.edges); setOrientation(e.orientation); } });
    sock.on('reactflow-nodes-changes', (e) => { if (e && thisUser && e.userId != thisUser.id) { setNodes(pre => applyNodeChanges(e.changes, pre)); }; });
    sock.on('reactflow-edges', (e) => { if (e) setEdges(e); });
    sock.on('reactflow-orientation', (e) => { if (e) setOrientation(e); });
    sock.on('reactflow-users', (e) => { if (e) setUsers(e); });
    setSocket(sock);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => { window.removeEventListener("beforeunload", handleBeforeUnload); };
  }, [thisUser, isPublicAccess, room, serverUrl]);

  const updateNodes = useCallback((newValue) => {
    setNodes((prevNodes) => {
      const updatedNodes = typeof newValue === 'function' ? newValue(prevNodes) : newValue;
      // if (isPublicAccess && socket?.connected) {
      //   socket.emit('reactflow-nodes', updatedNodes, room);
      // }
      return updatedNodes;
    });
  }, [socket, room, isPublicAccess, setNodes]);

  const updateEdges = useCallback((newValue) => {
    setEdges((prevEdges) => {
      const updatedEdges = typeof newValue === 'function' ? newValue(prevEdges) : newValue;
      if (isPublicAccess && socket?.connected) {
        socket.emit('reactflow-edges', updatedEdges, room);
      }
      return updatedEdges;
    });
  }, [socket, room, isPublicAccess, setEdges]);

  const updateOrientation = useCallback((newValue) => {
    setOrientation((prev) => {
      const updatedEdges = typeof newValue === 'function' ? newValue(prev) : newValue;
      if (isPublicAccess && socket?.connected) {
        socket.emit('reactflow-orientation', updatedEdges, room);
      }
      return updatedEdges;
    });
  }, [socket, room, isPublicAccess, setOrientation]);

  const onNodesChange = (changes = []) => {
    const new_changes = changes.filter(e => e.type != 'select');

    setNodes((pre) => {
      if (isPublicAccess && socket?.connected) {
        socket.emit('reactflow-nodes-changes', { userId: thisUser.id, changes: new_changes, nodes: applyNodeChanges(new_changes, pre) }, room);
      }
      return applyNodeChanges(changes, pre);
    });
  };

  const onEdgesChange = (changes) => {
    setEdges((eds) => {
      const data = applyEdgeChanges(changes, eds);
      if (isPublicAccess && socket?.connected) socket.emit('reactflow-edges', data, room);
      return data;
    });
  };

  const updateUsers = (user, newData) => {
    if (!user) return;
    const { id, name, image } = user;
    setUsers(pre => {
      const exists = pre.some(item => item.id == id);
      let res = [];
      if (exists) res = pre.map(item => item.id != id ? item : { ...item, ...newData });
      else res = [...pre, { id, name, image, ...newData }];
      if (isPublicAccess && socket?.connected) socket.emit('reactflow-users', res, room);
      return res
    });
  };


  return {
    nodes, setNodes: updateNodes, onNodesChange,
    edges, setEdges: updateEdges, onEdgesChange,
    hasRoom, orientation, setOrientation: updateOrientation,
    users, setUsers: updateUsers,
  };
};
