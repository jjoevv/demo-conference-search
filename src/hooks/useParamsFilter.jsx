import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/authContext';
import queryString from 'query-string';
import useSearch from './useSearch';

const useParamsFilter = () => {
  const {state, dispatch} = useAppContext()
  const {optionsSelected, addKeywords} = useSearch()
  const location = useLocation()
const [lastlocation, setLastLocation] = useState(null)

useEffect(() => {
  const search = location.search;
  const queryLocation = queryString.parse(search);

  // Kiểm tra nếu location.search không có giá trị
  if (!search) {
    queryLocation.page = ['1'];
  } else {
    // Lặp qua mỗi cặp key-value trong queryLocation
    Object.entries(queryLocation).forEach(([key, value]) => {
      if (key === 'page') {
        setPage(parseInt(value) - 1); //set page
      } else {
       // addKeywords(key, [value]); //add keyword
      }
    });
  }
}, [location.search]);


  const setPage = (page) => {
    dispatch({type: "SET_PARAMS", payload: page})
  }

  const addtoParams = useCallback((optionsSelected, pagenumber) => {
    const paramsFilter = {};
      // Thêm các key và giá trị từ optionsSelected vào paramsFilter
      for (const key in optionsSelected) {
          if (Object.prototype.hasOwnProperty.call(optionsSelected, key) && optionsSelected[key].length > 0) {
              paramsFilter[key] = optionsSelected[key];
          }
      }

      const search = location.search;
      const queryLocation = queryString.parse(search);
       // Tạo URL mới
       
       const queryFilter = new URLSearchParams(paramsFilter).toString()
       const newUrl = `?page=${pagenumber + 1}&${queryFilter}`;
       
       window.history.pushState({}, '', newUrl);

    // Chuyển hướng đến URL 
}, [optionsSelected])

  return { 
    paramsFilter: state.paramsFilter,
    pageParam: state.pageParam,
    setPage,
    addtoParams
   };
};

export default useParamsFilter;
