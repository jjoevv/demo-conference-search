// useAuth.js
// handleLogin, handleRegister, Logout, updateProfile
import { useAppContext } from '../context/authContext';
import { loginRequest, loginSuccess, loginFailure, logoutUser, registrationFailure } from '../actions/actions';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './api/baseApi';
import useLocalStorage from './useLocalStorage';
import useToken from './useToken';
import { useState } from 'react';
import usePageNavigation from './usePageNavigation';

const useAuth = () => {
  const { state, dispatch } = useAppContext();
  const { token, savetokenToLocalStorage } = useToken()
  const { user, saveUserToLocalStorage, deleteUserFromLocalStorage } = useLocalStorage()
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [isExpiredLogin, setIsExpired] = useState(false)
  const navigate = useNavigate()
  const {previousPath} = usePageNavigation()



  const handleLogin = async (email, password) => {
    dispatch(loginRequest());
    setLoading(true)
    try {
      if (!user || !token) {
        const response = await fetch(`${baseURL}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        setLoading(false)
        const responseData = await response.json()
        if (response.ok) {
          const userData = responseData.data
          
          saveUserToLocalStorage(userData)
          savetokenToLocalStorage(userData.accessToken)
         // dispatch({type: "LOGIN_SUCCESS", payload: {userData: userData}})
         await getCurrentUser()
          if(previousPath && userData.role !== 'admin' && !previousPath.includes('login') && !previousPath.includes('signup')){
            navigate(`${previousPath}`)
          }
          else {
            if(userData.role === 'admin'){
              navigate('/admin/dashboard')
            }
            else navigate('/')
          }
          

          return { status: true, message: responseData.message }
        } else {
          return { status: false, message: responseData.message }
        }
      }
      else {
        alert('You are still logged in.')
        navigate('/')
      }
    } catch (error) {
      dispatch(loginFailure('An error occurred during login.'));
    }

  };

  const handleRegister = async (email, password, phone) => {
    const account = {
      email: email,
      name: ' ',
      phone: phone,
      address: ' ',
      nationality: ' ',
      password: password
    }
    try {
      if (!user) {
        // Dispatch registration request action
        setLoading(true)

        // Make API request to register
        const response = await fetch(`${baseURL}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(account),
        });

        const responseData = await response.json();
        const responseMessages = responseData.message
        setLoading(false)
        if (response.ok) {
          return { status: true, message: responseMessages }
        } else {
          return { status: false, message: responseMessages }
        }
      }
      else {
        alert('You are still logged in.')
        navigate('/')
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('An error occurred during registration:', error);
      dispatch(registrationFailure('An error occurred during registration.'));
    }
  }

  const handleLogout = async () => {
    dispatch(logoutUser());
    dispatch({type: "LOGIN_SUCCESS", payload: null})
    sessionStorage.removeItem('user-id')
    deleteUserFromLocalStorage()
    navigate(`${previousPath}`)
    
//   window.location.reload()
  };


  const updateProfile = async (updateData) => {
    setLoading(true)
    let storedToken = JSON.parse(localStorage.getItem('token'));
    const tokenHeader = token ? token : storedToken
    try {
      const response = await fetch(`${baseURL}/user/infomation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenHeader}`
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await response.json();
      setLoading(false)
      if (!response.ok) {
        if(response.status === 401){
          setIsExpired(true)
        }
        setError(response.status) 
      }
      setLoading(false)
      return responseData
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  const changePassword = async (currentPassword, newPassword) => {
    setLoading(true)
    let storedToken = JSON.parse(localStorage.getItem('token'));
    const tokenHeader = token ? token : storedToken
    try {
      const response = await fetch(`${baseURL}/user/changePassword`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenHeader}`
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword
        })
      });

      const responseData = await response.json();
      setLoading(false)
      if (!response.ok) {
        if(response.status === 401){
          setIsExpired(true)
        }
        setError(response.status) 
      }
      return responseData
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const loginWithGoogle = async (userData) => {
    try {
      savetokenToLocalStorage(userData.accessToken)
      await getCurrentUser

    if(previousPath && userData.role !== 'admin' && !previousPath.includes('login') && !previousPath.includes('signup')){
      navigate(`${previousPath}`)
    }
    else {
      if(userData.role === 'admin'){
        navigate('/admin/dashboard')
      }
      else navigate('/')
    }
     
    
    } catch (error) {
      dispatch(loginFailure('An error occurred during login.'));
    }
    
  }

  const getCurrentUser = async () => {
    let storedToken = JSON.parse(localStorage.getItem('token'));
    const tokenHeader = token ? token : storedToken
    if(user || localStorage.getItem('user')){
      try {
        const response = await fetch(`${baseURL}/user/infomation`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenHeader}`
          },
        });
  
        if (!response.ok) {
          if(response.status === 401){
            setIsExpired(true)
          }
          setError(response.status)         
        }
        else {
          const data = await response.json()
          dispatch({type: "LOGIN_SUCCESS", payload: data.data})
          sessionStorage.setItem('user-id', JSON.stringify(data.data.id))
          localStorage.setItem('user', JSON.stringify(data.data));
          
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  return {
    user: state.user,
    error: error,
    userId,
    loading,
    isExpiredLogin,
    isLogin: state.isLogin,
    setIsExpired,
    handleLogin,
    handleRegister,
    handleLogout,
    updateProfile,
    changePassword,
    getCurrentUser,
    loginWithGoogle
  };
};

export default useAuth;
