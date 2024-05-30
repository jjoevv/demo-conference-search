// useNotification.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth';
import { useAppContext } from '../context/authContext';
import { getNotifications } from '../actions/notiAction';
import useLocalStorage from './useLocalStorage';
import useToken from './useToken';
import { baseURL } from './api/baseApi';

const useNotification = () => {
  const [isConnected, setIsConnected] = useState(false);
  const {user} = useLocalStorage()
  const {token} = useToken()
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useAppContext()
  const { getCurrentUser } = useAuth()

  let socketRef = useRef(null);
  const user_id = JSON.parse(sessionStorage.getItem('user-id'))

  useEffect(() => {
    getCurrentUser()
    const socket = io(`https://conference-searching.onrender.com`, {
      query: {
        "user-id": user_id
      },
      path: '/socket.io',
      transports: ["websocket", 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to socket.io server');
      setIsConnected(true);
    });

    socket.on('notification', (message) => {
      console.log({message})
      getAllNotifications()
      
    });
    getAllNotifications();



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
      //console.log('Disconnected from socket server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch, user_id]);

 


  const getAllNotifications = async () => {
    setLoading(true)
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        const response = await fetch(`${baseURL}/notification`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
        });
        const data = await response.json()        
        setLoading(false)
        if (response.ok) {
          dispatch(getNotifications(data.data))
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }

  const getNoticationById = async (unreadNotifications) => {
    if(user || localStorage.getItem('user')){
      let storedToken = JSON.parse(localStorage.getItem('token'));
      const tokenHeader = token ? token : storedToken
      try {
        for (const noti of unreadNotifications) {
          const response = await fetch(`${baseURL}/notification/${noti.tid}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${tokenHeader}`
            },
          });
          if(response.ok){
            getAllNotifications()
          }
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }
  return { 
    socket: socketRef,
    notifications: state.notifications,
    isConnected: isConnected,
    loading,
    getNoticationById,
    getAllNotifications
   };
};

export default useNotification;
