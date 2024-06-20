import { useEffect, useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/confAction"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import useSessionStorage from "./useSessionStorage"
import { sortByFollow } from "../utils/sortConferences"
import useAuth from "./useAuth"
import useLocalStorage from "./useLocalStorage"
import useNotification from "./useNotification"

const useConference = () => {
  const { state, dispatch } = useAppContext()
  const { user } = useAuth()
  const { getDataListInStorage } = useSessionStorage()
  const [quantity] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {token} = useLocalStorage()
  const [selectOptionSort, setSelectOptionSort] = useState('Random') //Random: sort by follow
  const [displaySortList, setDisplaySortConf] = useState([])
  const [isCrawling, setIsCrawling] = useState(false)

  useEffect(() => {
    setDisplaySortConf(state.conferences)
  }, [selectOptionSort])

  const handleSelectOptionSort = (option) => {
    setSelectOptionSort(option)
  }

  const getAllConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/conference?status=true`, {
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

      dispatch(getAllConf(data.data));
      setLoading(false);
      return data
    } catch (error) {
      setError(error);
    }
  }



  const handleGetOne = async (id) => {
    try {
      if(user || localStorage.getItem('user')){
        
        let storedToken = JSON.parse(localStorage.getItem('token'));
        const tokenHeader = token ? token : storedToken
        const response = await fetch(`${baseURL}/conference/${id}`,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenHeader}`
          }
        });
        const data = await response.json();
        //Gửi action để cập nhật state
        dispatch(getOneConf(data.data));
      }
      else {
        const response = await fetch(`${baseURL}/conference/${id}`,{
          method: 'GET',
          
        });
        const data = await response.json();
        //Gửi action để cập nhật state
        dispatch(getOneConf(data.data));
      }

    } catch (error) {

      console.error('Error fetching data:', error);
    }
  }

  const crawlNow = async (id) => {
    try {
    //  console.log({ user })

      let confIDs = sessionStorage.getItem('confIDs');
      if (confIDs) {
        // Nếu đã có danh sách confIDs trong localStorage, chuyển đổi thành mảng
        confIDs = JSON.parse(confIDs);
        // Kiểm tra xem id đã tồn tại trong danh sách chưa
        if (!confIDs.includes(id)) {
          // Nếu chưa tồn tại, thêm vào danh sách
          confIDs.push(id);
          sessionStorage.setItem('confIDs', JSON.stringify(confIDs));
        }
      }
      confIDs = [id];
      sessionStorage.setItem('confIDs', JSON.stringify(confIDs));

      // Thiết lập đếm ngược 10 phút để xóa ID
      setTimeout(() => {
        removeIDFromSessionStorage(id);
      }, 10 * 60 * 1000); // 10 phút
    
      // Tạo headers cho request
      const headers = {
        'Content-Type': 'application/json',
      };
    

      const socket_id = JSON.parse(sessionStorage.getItem('socket-id'))
      
      console.log({socket_id})
        const response = await fetch(`${baseURL}/conference/${id}/updateNow`, {
          method: 'PUT',    
          headers: headers,     
          body: JSON.stringify({socketID: socket_id})
        });
      //console.log(response)
      if (!response.ok) {
        throw new Error('Request failed with status ' + response.status);
      }

      const data = await response.json();

      return { status: true, message: data.message };
    } catch (error) {
      console.error('Error fetching data:', error);
      return { status: false, message: error.message };
    }
  };

  // Hàm xóa ID khỏi sessionStorage
  const removeIDFromSessionStorage = (idToRemove) => {
    let confIDs = sessionStorage.getItem('confIDs');
    if (confIDs) {
      confIDs = JSON.parse(confIDs);
      const updatedConfIDs = confIDs.filter((id) => id !== idToRemove);
      sessionStorage.setItem('confIDs', JSON.stringify(updatedConfIDs));
   //   console.log(`Removed ID ${idToRemove} from sessionStorage`);
    } else {
      console.log('No IDs found in sessionStorage');
    }
  };

  const checkUrl = async (url) => {
    if (url !== ' ' && url !== '') {
      return true
    }
    else return false
  };


  const getConferenceDate = (organizations) => {
    if (organizations?.length > 0) {

      // Khởi tạo biến để lưu trữ ngày bắt đầu và kết thúc
      let startDate = null;
      let endDate = null;
      // Lặp qua danh sách organizations để tìm ngày bắt đầu và kết thúc với status là "new"
      organizations.forEach(org => {
        if (org.status === "new") {
          startDate = org.start_date;
          endDate = org.end_date;
        }
      });
      const formattedDateStartDate = moment(startDate).format('ddd, YYYY/MM/DD');
      const formattedDateEndDate = moment(endDate).format('ddd, YYYY/MM/DD');

      // Xác định dateRange dựa trên giá trị của startDate và endDate
      let dateRange = '';
      if (startDate) {
        if (endDate) {
          if (moment(startDate).isAfter(endDate)) {
            dateRange = `${formattedDateStartDate}`;
          } else {
            dateRange = `${formattedDateStartDate} to ${formattedDateEndDate}`;
          }
        } else {
          dateRange = `${formattedDateStartDate}`;
        }
      }
      return dateRange
    }
    else return ''
  }

  const getStartEndDate = (organizations) => {
    if (organizations.length > 0) {

      // Khởi tạo biến để lưu trữ ngày bắt đầu và kết thúc
      let startDate = null;
      let endDate = null;
      // Lặp qua danh sách organizations để tìm ngày bắt đầu và kết thúc với status là "new"
      organizations.forEach(org => {
        if (org.status === "new") {
          startDate = org.start_date;
          endDate = org.end_date;
        }
      });
      const formattedDateStartDate = moment(startDate).format('YYYY/MM/DD');
      const formattedDateEndDate = moment(endDate).format('YYYY/MM/DD');

      // Xác định dateRange dựa trên giá trị của startDate và endDate
      if (startDate) {
        if (endDate && moment(startDate).isAfter(endDate)) {
          return (
            <span>
              {formattedDateStartDate}
            </span>
          )
        }
        else if (endDate) {
          return (
            <span>
              {formattedDateStartDate} <FontAwesomeIcon icon={faArrowRight} /> {formattedDateEndDate}
            </span>
          )

        } else {
          return (
            <span>
              {formattedDateStartDate}
            </span>
          )
        }
      }

    }
    else return null
  }

  const getLocation = (organizations) => {
    // Sử dụng find để tìm đối tượng đầu tiên có status là "new" và location khác null
    const newOrg = organizations.find(org => org.status === "new" && org.location !== null);

    // Nếu tìm thấy đối tượng thỏa mãn, trả về location của nó, ngược lại trả về null
    return newOrg ? newOrg.location : '';
  }


  return {
    conferences: state.conferences,
    conference: state.conference,
    quantity: quantity,
    loading,
    error: error,
    selectOptionSort,
    displaySortList,
    message: state.message,
    getAllConferences,
    handleGetOne,
    getConferenceDate,
    getStartEndDate,
    getLocation,
    handleSelectOptionSort,
    crawlNow,
    checkUrl
  }
}

export default useConference