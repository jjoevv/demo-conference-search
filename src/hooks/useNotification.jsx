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
  const { token } = useToken()
  const [loading, setLoading] = useState(false)
  const { state, dispatch } = useAppContext()
  const { user, userId, isLogin, getCurrentUser, setIsExpired } = useAuth()
  const [id, setId] = useState(null);
  let socketRef = useRef(null);



  useEffect(() => {
    const userID = JSON.parse(sessionStorage.getItem('user-id'))
    const fetchUserId = async () => {
      try {
        await getCurrentUser()
        if (userID) {
           setId(userID)       
        }
        else {
          const generatedID = generateRandomUserId()
          setId(generatedID)
        }

      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
  //  console.log({user, userID, id, idStored})
    if(!user){
      fetchUserId()
    }
  }, [user]);

  useEffect(() => {
    console.log({ id, socketRef, isConnected });

    if (id && !socketRef.current) {
      try {
        socketRef.current = io(`https://conference-searching.onrender.com`, {
          query: {
            "user-id": id
          },
          path: '/socket.io',
          transports: ["websocket", 'polling']
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
          console.log('Connected to socket.io server');
          setIsConnected(true);
        });

        socket.on('notification', (message) => {
          console.log('Received notification:', message);
          if (message.id) {
            dispatch({ type: 'SET_NOTI_MESSAGE_CRAWL', payload: message });
          }
          dispatch(getAllNotifications());
        });

        socket.on("connect_error", (err) => {
          console.error('Connect error:', err.message);
          console.error('Description:', err.description);
          console.error('Context:', err.context);
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from socket server');
          setIsConnected(false);
        });
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
      
      return () => {
        alert('out')
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }

  }, [id, dispatch]);


  function generateRandomUserId() {
    const prefix = "guest";
    const randomString = Math.floor(100000000000000 + Math.random() * 900000000000000); // Generates a random alphanumeric string
    return prefix + randomString;
  }




  const getAllNotifications = async () => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
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
        else if (response.status === 401) {
          setIsExpired(true)
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }

  const getNoticationById = async (unreadNotifications) => {
    if (user || localStorage.getItem('user')) {
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
          if (response.ok) {
            getAllNotifications()
          }
          else if (response.status === 401) {
            setIsExpired(true)
          }
        }
      } catch (error) {
        throw new Error('Network response was not ok');
      }
    }
  }
  return {
    socketRef: socketRef,
    notifications: state.notifications,
    message: state.message,
    isConnected: isConnected,
    loading,
    getNoticationById,
    getAllNotifications
  };
};

export default useNotification;