import React, { createContext, useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useAuth from '../Hooks/useAuth';

type SocketContextType = {
  socket: Socket | null;
  connected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

const toSocketBaseUrl = (rawUrl: string) => rawUrl.replace(/\/api\/?$/i, '').replace(/\/$/, '');

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let active = true;
    let nextSocket: Socket | null = null;

    const connect = async () => {
      if (!user) {
        setSocket((prev) => {
          prev?.disconnect();
          return null;
        });
        setConnected(false);
        return;
      }

      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        setConnected(false);
        return;
      }

      const token = await user.getIdToken();
      const socketBaseUrl = toSocketBaseUrl(apiUrl);
      nextSocket = io(socketBaseUrl, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        auth: { token },
      });

      nextSocket.on('connect', () => setConnected(true));
      nextSocket.on('disconnect', () => setConnected(false));
      nextSocket.on('connect_error', () => setConnected(false));

      if (active) {
        setSocket(nextSocket);
      }
    };

    connect();

    return () => {
      active = false;
      if (nextSocket) {
        nextSocket.removeAllListeners();
        nextSocket.disconnect();
      }
    };
  }, [user]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

