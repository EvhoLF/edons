import { useCallback, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'; // Импортируем Socket из socket.io-client

interface SocketStats {
  rooms: number,
  users: any,
  memoryMB: string,
  uptimeSec: string,
}

const socketStats_init = {
  rooms: 0,
  users: null,
  memoryMB: '0 MB',
  uptimeSec: '0 Sec',
}

const useSocketStats = (serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketStats, setSocketStats] = useState<SocketStats>(socketStats_init);

  useEffect(() => {
    const sock = io(serverUrl);
    sock.on('server-stats', stats => { setSocketStats(stats); });
    setSocket(sock);
    return () => { sock.disconnect(); };
  }, [serverUrl]);

  const requestSocketStats = useCallback(() => {
    if (socket?.connected) socket.emit('server-stats');
  }, [socket]);

  return { requestSocketStats, socketStats }
}

export default useSocketStats