import { useContext } from 'react';
import { SocketContext } from '../providers/SocketProvider';

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;

