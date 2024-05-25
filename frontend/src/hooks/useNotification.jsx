// useNotification.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth';
import { useAppContext } from '../context/authContext';
import { getNotifications } from '../actions/notiAction';


const useNotification = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { state, dispatch } = useAppContext()
  const { getCurrentUser } = useAuth()

  const [hasNewNotification, setHasNewNotification] = useState(false);
  let socketRef = useRef(null);
  useEffect(() => {
    getCurrentUser()
    const user_id = JSON.parse(sessionStorage.getItem('user-id'))

    const socket = io(`https://conference-searching.onrender.com`, {
      query: {
        'user-id': user_id
      },
      path: '/socket.io',
      transports: ["websocket", 'polling']
    });

    socket.on('connection', () => {
      console.log('Connected to socket.io server');
      setIsConnected(true);
    });

    socket.on('notification', (message) => {
      localStorage.setItem('noti_dot', JSON.stringify('true'))
      dispatch(getNotifications(message))
      setHasNewNotification(true);
      console.log({message})
    });




    socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log(err.message);

      // some additional description, for example the status code of the initial HTTP response
      console.log(err.description);

      // some additional context, for example the XMLHttpRequest object
      console.log(err.context);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      // Xử lý lỗi ở đây nếu cần thiết
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, socketRef]);

 

  return { 
    socket: socketRef,
    notifications: state.notifications,
    hasNewNotification: hasNewNotification,
    isConnected: isConnected,
   };
};

export default useNotification;
