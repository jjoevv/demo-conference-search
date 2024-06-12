import {  useEffect, useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/confAction"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import useSessionStorage from "./useSessionStorage"
import { sortByFollow } from "../utils/sortConferences"

const useConference = () => {
  const { state, dispatch } = useAppContext()
  const { getDataListInStorage } = useSessionStorage()
  const [quantity] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [selectOptionSort, setSelectOptionSort] = useState('Random') //Random: sort by follow
  const [displaySortList, setDisplaySortConf] = useState([])



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
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      //Gửi action để cập nhật state
      dispatch(getOneConf(data.data));
    } catch (error) {

      console.error('Error fetching data:', error);
    }
  }

  const crawlNow = async (id) => {
    try {
        const response = await fetch(`https://conference-crawler-v2.onrender.com/api/scrape/conference/${id}`, {
            timeout: 60000, // Thiết lập thời gian chờ là 1 phút (60 giây)
        });
//console.log(response.status)
        if (!response.ok) {
            throw new Error('Request failed with status ' + response.status);
        }

        const data = await response.json();
        
        return { status: true, data: data };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { status: false, message: error.message };
    } 
};



  const getConferenceDate = (organizations) => {
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
    getAllConferences,
    handleGetOne,
    getConferenceDate,
    getStartEndDate,
    getLocation,
    handleSelectOptionSort,
    crawlNow
  }
}

export default useConference