import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

interface stateWebSocket {
  userCount: number,
}

const initialStateWebSocket: stateWebSocket = {
  userCount: 0,
}

const useWebSocket = () => {
  const [state, setState] = useState<stateWebSocket>(initialStateWebSocket);

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:3005');
    }

    socket.on("updateUsers", (userCount: number) => {
      setState(prev => ({ ...prev, userCount }));
    });

    return () => {
      socket?.disconnect();
    };
  }, [setState]);

  return state;
};

export default useWebSocket;
