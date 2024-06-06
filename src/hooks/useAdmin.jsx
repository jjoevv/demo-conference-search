
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'

const useAdmin = () => {
  const {state, dispatch} = useAppContext()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [loading, setLoading] = useState(false)

  const getAllUsers = async () => {
    setLoading(true)
    if (user || localStorage.getItem('user')) {
        let storedToken = JSON.parse(localStorage.getItem('token'));
  
        const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenHeader}`
          }
        });
        if (!response.ok) {
          throw new Error(response.message);
        }
        const data = await response.json(); 
        
        setLoading(false)
        // Sử dụng hàm này để lấy thông tin từ danh sách dựa trên OrganizationOrgId
        dispatch({type: "ADMIN_GET_USERS", payload: data.data})
      }
  }

  const getUserById = async (id) => {
    const copied = [...state.users]
    const filteredUser = copied.filter(item => item.id === id);
    dispatch({type: 'ADMIN_GET_USER', payload: filteredUser[0]})    
  }
    return {
        users: state.users,
        userAccount: state.userAccount,
        loading,
        getAllUsers,
        getUserById
    }
  }


  export default useAdmin