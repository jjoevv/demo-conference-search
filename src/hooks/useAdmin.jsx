
import { useAppContext } from '../context/authContext'
import { baseURL } from './api/baseApi'
import useToken from './useToken'
import useLocalStorage from './useLocalStorage'
import { useState } from 'react'
import * as XLSX from 'xlsx'
const useAdmin = () => {
  const { state, dispatch } = useAppContext()
  const { user } = useLocalStorage()
  const { token } = useToken()
  const [loading, setLoading] = useState(false)

  const getAllPendingConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/conference?status=false`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      dispatch({ type: "GET_ALL_PENDING_CONFERENCES", payload: data.data })
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
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
      dispatch({ type: "ADMIN_GET_USERS", payload: data.data })
    }
  }
  const getUserById = async (id) => {
    const copied = [...state.users]
    const filteredUser = copied.filter(item => item.id === id);
    dispatch({ type: 'ADMIN_GET_USER', payload: filteredUser[0] })
  }


  const getPendingConfById = async (id) => {
    try {
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      //Gửi action để cập nhật state
      dispatch({ type: 'GET_PENDING_CONFERENCE', payload: data.data })
    } catch (error) {

      console.error('Error fetching data:', error);
    }

  }


  const activePost = async (id) => {
    setLoading(true)

    if (user || localStorage.getItem('user')) {
      const response = await fetch(`${baseURL}/post/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setLoading(false)
      if (!response.ok) {
        throw new Error(response.message);
      }
      else {
        const message = data.message || data.data
        return { status: true, message }
      }
    }
  }

  const deactivePost = async (id) => {
    setLoading(true)

    if (user || localStorage.getItem('user')) {
      const response = await fetch(`${baseURL}/post/${id}/deactivate`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json'
        },
      });
      const data = await response.json();
      setLoading(false)
      if (!response.ok) {
        throw new Error(response.message);
      }
      else {
        const message = data.message || data.data
        return { status: true, message }
      }
    }
  }
  const handleGetHeadersExport = (headers) => {
    dispatch({ type: 'SET_HEADERS_EXPORT', payload: headers })
  }


  const exportToExcel = (data) => {
    const headers = state.headersExport
      .filter(column => column.Header !== 'Action')
      .map(column => column.Header);

    // Extract data
    const rows = data.map((row, index) => {
      const rowData = [];
      state.headersExport.forEach(column => {
        if (column.Header === '#') {
          rowData.push(index + 1)
        }
        else if (column.Header !== 'Action') {
          let value;
          if (column.accessor) {
            if (typeof column.accessor === 'function') {
              value = column.accessor(row);

              if (column.accessor(row).props?.children?.length > 0) {
                value = row.information.fieldOfResearch.join('; ');
              }
            } else {

              value = column.accessor
            }
          } else if (column.Cell) {
            value = column.Cell({ row: { original: row } }).props.children;
          }
          rowData.push(value);
        }
      });
      return rowData;
    });
    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'confhubdata.xlsx');
  };

  return {
    pendingConferences: state.pendingConferences,
    pendingConf: state.pendingConf,
    users: state.users,
    userAccount: state.userAccount,
    loading,
    getAllPendingConferences,
    getPendingConfById,
    getAllUsers,
    getUserById,
    deactivePost,
    exportToExcel,
    activePost,
    allColumns: state.headersExport,
    handleGetHeadersExport
  }
}


export default useAdmin