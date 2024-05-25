import { useCallback, useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/confAction"
import moment from "moment"

const useConference = () => {
  const { state, dispatch } = useAppContext()
  const [quantity] = useState(0)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(0)
  const [totalConferences, setTotalConferences] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async (page) => {
    try {
      const response = await fetch(`${baseURL}/conference?page=${page}&size=7`,{
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
      return data
    } catch (error) {
      setError(error);
    }
  }, [dispatch]);
  
  const handleGetList = async () => {
    setLoading(true)
    try {
      if(state.conferences.length === 0){
        const firstPageData = await fetchData(1);                
        const totalPages = firstPageData.maxPages; // Lấy số lượng trang từ dữ liệu đầu tiên
        const totalConf = firstPageData.maxRecords
        
        const total = firstPageData.maxPages; // Lấy số lượng trang từ dữ liệu đầu tiên
        setTotalConferences(totalConf)
        setTotalPages(total)
        dispatch(getAllConf(firstPageData.data));

        // Fetch remaining pages asynchronously
        for (let i = 2; i <= totalPages; i++) {
            const pageData = await fetchData(i);
            dispatch(getAllConf(pageData.data));
        }
      }

      setLoading(false);
  } catch (error) {
      setError(error);
      setLoading(false);
  }
  }

  const handleGetOne = async (id) => {
    try {
      //size = 5
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      //Gửi action để cập nhật state
      dispatch(getOneConf(data.data));
    } catch (error) {

      console.error('Error fetching data:', error);
    }
  }

  const getConferenceDate = (organizations) => {
    if(organizations.length > 0) {

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
    const formattedDateStartDate = moment(startDate).format('dddd, MM/DD/YYYY');
    const formattedDateEndDate = moment(endDate).format('dddd, MM/DD/YYYY');
    
    // Xác định dateRange dựa trên giá trị của startDate và endDate
    let dateRange = 'N/A';
    if (startDate) {
      if (endDate) {
        dateRange = `From ${formattedDateStartDate} to ${formattedDateEndDate}`;
      } else {
        dateRange = `${formattedDateStartDate}`;
      }
    }
    return dateRange
    }
    else return ''
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
    totalPages,
    totalConferences,
    handleGetList,
    handleGetOne,
    getConferenceDate,
    getLocation
  }
}

export default useConference