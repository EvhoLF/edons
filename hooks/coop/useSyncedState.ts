import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client'; // Импортируем Socket из socket.io-client

interface UseSyncedStateOptions<T> {
  initialState: T;
  roomName: string;
  serverUrl: string;
  enabled?: boolean
}

export function useSyncedState<T>({ initialState, room, serverUrl, enabled = true }: UseSyncedStateOptions<T>) {
  const [state, setState] = useState<T>(initialState);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sock = io(serverUrl);
    sock.emit('joinRoom', room);
    sock.on('message', (message: T) => {
      setState(message);
    });
    setSocket(sock);

    return () => { sock.disconnect(); };
  }, [room, serverUrl, enabled]);

  const updateState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(prevState => {
      const updatedState =
        typeof newState === 'function'
          ? (newState as (prev: T) => T)(prevState)
          : newState;

      if (enabled && socket?.connected && room) {
        socket.emit('message', updatedState, room);
      }

      return updatedState;
    });
  }, [socket, room, enabled]);
  

  return [state, updateState] as const;
}