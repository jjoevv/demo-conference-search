import { useCallback, useEffect, useState } from "react"

import { useAppContext } from "../context/authContext"

import { baseURL } from "./api/baseApi"
import { getAllConf, getOneConf } from "../actions/confAction"
import moment from "moment"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import useSessionStorage from "./useSessionStorage"
import useLocalStorage from "./useLocalStorage"

const useConference = () => {
  const { state, dispatch } = useAppContext()
  const { getDataListInStorage } = useSessionStorage()
  const { getItemInLocalStorage } = useLocalStorage()
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

  const fetchData = useCallback(async (page, size) => {
    try {
      const response = await fetch(`${baseURL}/conference?page=${page}&size=${size}`, {
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
  }, []);

  const handleGetList = async () => {

    setLoading(true)

    try {
      const currentFetchPage = getItemInLocalStorage('currentFetchPageLS')
      const firstPageData = await fetchData(1, 1);
      const totalConf = firstPageData.maxRecords // get total conferences from first page data
      const maxPagesFetch = Math.ceil(totalConf / 20); // get total pages from first page data

      if (state.conferences.length === 0) {


        if (!currentFetchPage || currentFetchPage === 1) {
          //data didnt save in local storage
          localStorage.setItem('currentFetchPageLS', JSON.stringify(1))
          localStorage.setItem('totalConferences', JSON.stringify(totalConf))
          const maxPages = Math.ceil(totalConf / 7)
          localStorage.setItem('totalPagesConferences', JSON.stringify(maxPages))

          const firstPageData = await fetchData(1, 20);

          setLoading(false)

          const listFollowed = getDataListInStorage("listFollow")
          const filteredData = firstPageData.data.filter(
            item => !listFollowed.some(conf => conf.id === item.id)
          );

          const updatedConferences = [...new Set([...listFollowed, ...filteredData])];

          localStorage.setItem('conferences', JSON.stringify(updatedConferences))
          dispatch(getAllConf(updatedConferences));

          // Fetch remaining pages asynchronously and save to localstorage
          for (let i = 2; i <= maxPagesFetch; i++) {
            const pageData = await fetchData(i, 20);
            const filteredNextData = pageData.data.filter(
              item => !listFollowed.some(conf => conf.id === item.id)
            );
            localStorage.setItem('currentFetchPageLS', JSON.stringify(i)) //save current fetch page
            dispatch(getAllConf(filteredNextData));
            const conferencesStored = getItemInLocalStorage('conferences')

            const updatedConferencesNext = [...new Set([...conferencesStored, ...filteredNextData])];

            localStorage.setItem('conferences', JSON.stringify(updatedConferencesNext))
          }
          return
        }

        if (currentFetchPage && maxPagesFetch === currentFetchPage) {
          //full data saved in local storage
          const conferencesStored = getItemInLocalStorage('conferences')
          const data = conferencesStored ? conferencesStored : []
          dispatch(getAllConf(data));
          //saveDataToFile(data)
          setLoading(false)
          return
        }
        else {
          //a part of data saved in local storage
          if (currentFetchPage > 1) {
            setLoading(false)
            const conferencesStored = getItemInLocalStorage('conferences')
            const listFollowed = getDataListInStorage("listFollow")
            // Loại bỏ các phần tử trùng lặp
            const uniqueData = conferencesStored.filter(item => !listFollowed.some(followedItem => followedItem.id === item.id));

            // Gộp `listFollowed` lên đầu `uniqueData`
            const sortedData = [...listFollowed, ...uniqueData];
            dispatch(getAllConf(sortedData));
            localStorage.setItem('conferences', JSON.stringify(sortedData))


            // Fetch remaining pages asynchronously and save to localstorage
            for (let i = currentFetchPage + 1; i <= maxPagesFetch; i++) {
              const pageData = await fetchData(i, 20);
              const filteredNextData = pageData.data.filter(
                item => !listFollowed.some(conf => conf.id === item.id)
              );
              localStorage.setItem('currentFetchPageLS', JSON.stringify(i)) //save current fetch page
              dispatch(getAllConf(filteredNextData));
              const conferencesStored = getItemInLocalStorage('conferences')

              const updatedConferencesNext = [...new Set([...conferencesStored, ...filteredNextData])];

              localStorage.setItem('conferences', JSON.stringify(updatedConferencesNext))
            }
            return

          }
        }
      }


      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  }

  const handleGetOne = async (id) => {
    setLoading(true)
    try {
      //size = 5
      const response = await fetch(`${baseURL}/conference/${id}`);
      const data = await response.json();
      //Gửi action để cập nhật state
      dispatch(getOneConf(data.data));
      setLoading(false)
    } catch (error) {

      console.error('Error fetching data:', error);
    }
  }

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
      const formattedDateStartDate = moment(startDate).format('dddd, YYYY/MM/DD');
      const formattedDateEndDate = moment(endDate).format('dddd, YYYY/MM/DD');

      // Xác định dateRange dựa trên giá trị của startDate và endDate
      let dateRange = '';
      if (startDate) {
        if (endDate) {
          if (moment(startDate).isAfter(endDate)) {
            dateRange = `${formattedDateStartDate}`;
          } else {
            dateRange = `From ${formattedDateStartDate} to ${formattedDateEndDate}`;
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
    fetchData,
    handleGetList,
    handleGetOne,
    getConferenceDate,
    getStartEndDate,
    getLocation,
    handleSelectOptionSort
  }
}

export default useConference