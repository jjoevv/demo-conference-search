import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/authContext';
import queryString from 'query-string';

const useParamsFilter = (optionFilter) => {
  const {state, dispatch} = useAppContext()
  const location = useLocation()
  const [filterStatus, setFilterStatus] = useState(()=>{
    const paramsFilter = {};

    // Thêm các key và giá trị từ optionsSelected vào paramsFilter
    for (const key in optionFilter) {
        if (Object.prototype.hasOwnProperty.call(optionFilter, key) && optionFilter[key].length > 0) {
            paramsFilter[key] = optionFilter[key];
        }
    }

    const search = location.search
    const queryFilter = new URLSearchParams(paramsFilter).toString()
    const queryLocation = queryString.parse(search)
    console.log({queryLocation, queryFilter})
   
    return  `?page=${state.pageParam + 1}&${queryFilter}` || `?page=1`
  })
  
  const setPage = (page) => {
    dispatch({type: "SET_PARAMS", payload: page})
  }

  const addtoParams = (optionsSelected) => {
    const paramsFilter = {};

    // Thêm các key và giá trị từ optionsSelected vào paramsFilter
    for (const key in optionsSelected) {
        if (Object.prototype.hasOwnProperty.call(optionsSelected, key) && optionsSelected[key].length > 0) {
            paramsFilter[key] = optionsSelected[key];
        }
    }

     // Tạo query string từ paramsFilter
     const queryString = new URLSearchParams(paramsFilter).toString();

     // Tạo URL mới
     const newUrl = `?page=${state.pageParam + 1}&${queryString}`;
   // window.history.pushState({}, '', newUrl);
     // Chuyển hướng đến URL mới
     //window.location.href = newUrl;
     console.log({paramsFilter, newUrl, queryString, location})
     
  }

  return { 
    filterStatus,
    pageParam: state.pageParam,
    setPage,
    addtoParams
   };
};

export default useParamsFilter;
