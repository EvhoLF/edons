//useSyncedFlow.tsx
import { Log } from '@/DB/models/Log';
import { IUser } from '@/DB/models/User';
import {
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { Session } from 'next-auth';
import { useEffect, useCallback, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface useSyncedFlowProps {
  isPublicAccess: boolean;
  serverUrl: string;
  room: string;
  session: Session;
}

interface User {
  id: string;
  name: string;
  image: string;
  pos: [number, number];
}

export const useSyncedFlow = ({
  session = null,
  isPublicAccess = false,
  room,
  serverUrl = 'http://localhost:3005',
}: useSyncedFlowProps) => {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [orientation, setOrientation] = useState('TB');
  const [users, setUsers] = useState<User[]>([]);
  const [codeData, setCodeData] = useState([]);
  const socketRef = useRef<Socket | null>(null);
  const sessionRef = useRef<Session | null>(session);
  const [hasRoom, setHasRoom] = useState<boolean>(true);
  // Обновляем sessionRef при изменении session
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const isReady = isPublicAccess && session?.user;

  // Подключение сокета
  useEffect(() => {
    if (isReady) {
      const sock = io(serverUrl);
      socketRef.current = sock;

      // при закрытии вкладки
      const handleBeforeUnload = () => {
        sock.emit('reactflow-disconected', sessionRef.current?.user?.id, room);
      };

      sock.emit('joinRoomReactflow', sessionRef.current?.user, room);

      // **новый** initial state хендлер
      sock.on('reactflow', (e) => {
        if (e) {
          setHasRoom(e.hasRoom);
          setNodes(e.nodes);
          setEdges(e.edges);
          setOrientation(e.orientation);
          setCodeData(e.codeData);      // ← добавлено
          setUsers(e.users);            // ← добавлено
        }
      });

      // остальные хендлеры
      sock.on('reactflow-nodes-changes', (e) => {
        if (e?.userId !== sessionRef.current?.user?.id) {
          setNodes((prev) => applyNodeChanges(e.changes, prev));
        }
      });
      sock.on('reactflow-nodes', e => {
        setNodes(prev => {
          const newData = e.map((n) => {
            const old = prev.find((o) => o.id === n.id);
            return {
              ...n,
              selected: old?.selected ?? n.selected,
              dragging: old?.dragging ?? n.dragging,
            };
          });
          return newData
        });
      });
      sock.on('reactflow-edges', setEdges);
      sock.on('reactflow-orientation', setOrientation);
      sock.on('reactflow-users', setUsers);
      sock.on('reactflow-codedata', setCodeData);

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        sock.disconnect();
      };
    }
  }, [isReady, serverUrl, room]);

  const emitIfConnected = (event: string, payload: any) => {
    const sock = socketRef.current;
    if (isReady && sock?.connected) {
      sock.emit(event, payload, room);
    }
  };

  const updateNodes = useCallback((newValue) => {
    setNodes((prev) => {
      const updated = typeof newValue === 'function' ? newValue(prev) : newValue;
      emitIfConnected('reactflow-nodes', updated);
      return updated;
    });
  }, [isReady, room]);

  const updateEdges = useCallback((newValue) => {
    setEdges((prev) => {
      const updated = typeof newValue === 'function' ? newValue(prev) : newValue;
      emitIfConnected('reactflow-edges', updated);
      return updated;
    });
  }, [isReady, room]);

  const updateOrientation = useCallback((newValue) => {
    setOrientation((prev) => {
      const updated = typeof newValue === 'function' ? newValue(prev) : newValue;
      emitIfConnected('reactflow-orientation', updated);
      return updated;
    });
  }, [isReady, room]);

  const onNodesChange = (changes = []) => {
    const filteredChanges = changes.filter((e) => e.type !== 'select');
    setNodes((prev) => {
      const updatedNodes = applyNodeChanges(changes, prev);
      emitIfConnected('reactflow-nodes-changes', {
        userId: sessionRef.current?.user?.id,
        changes: filteredChanges,
      });
      return updatedNodes;
    });
  };

  const onEdgesChange = (changes) => {
    setEdges((prev) => {
      const updated = applyEdgeChanges(changes, prev);
      emitIfConnected('reactflow-edges', updated);
      return updated;
    });
  };

  const updateUsers = (user, newData) => {
    if (!user) return;

    setUsers(prev => {
      const exists = prev.some(u => u.id === user.id);
      // либо обновляем, либо добавляем
      const merged = exists
        ? prev.map(u => u.id === user.id ? { ...u, ...newData } : u)
        : [...prev, { ...user, ...newData }];

      // удаляем дубли по id
      const deduped = Array.from(
        new Map(merged.map(u => [u.id, u]))
          .values()
      );
      emitIfConnected('reactflow-users', deduped);
      return deduped;
    });
  };


  const updateCode = useCallback((newValue: any[] | ((prev: any[]) => any[])) => {
    setCodeData((prev) => {
      const updated = typeof newValue === 'function' ? newValue(prev) : newValue;
      emitIfConnected('reactflow-codedata', updated);
      return updated;
    });
  }, [isReady, room]);

  return {
    hasRoom,
    codeData, setCodeData: updateCode,
    nodes, setNodes: updateNodes, onNodesChange,
    edges, setEdges: updateEdges, onEdgesChange,
    orientation, setOrientation: updateOrientation,
    users, setUsers: updateUsers,
  };
};
