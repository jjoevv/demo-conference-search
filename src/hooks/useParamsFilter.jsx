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
     // console.log({location})
     const search = location.search;
     const queryLocation = queryString.parse(search);
     
     // Kiểm tra nếu location.search không có giá trị
     if (!search) {
       queryLocation.page = ['1']
     } else {
       console.log(search, queryLocation)
   
       // Lặp qua một mảng chứa tất cả các key
       const keys = Object.keys(queryLocation);
       keys.forEach(key => {
         if (key === 'page') {
           setPage(parseInt(queryLocation[key])-1)  //set page
           console.log({key})
         } else {
           addKeywords(key, [queryLocation[key]]) //add keyword
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
       const newPageNumber = queryLocation['page'] ? queryLocation['page']: pagenumber
       const queryFilter = new URLSearchParams(paramsFilter).toString()
       const newUrl = `?page=${pagenumber + 1}&${queryFilter}`;
       
       window.history.replaceState({}, '', newUrl);

    // Chuyển hướng đến URL mới
    console.log({paramsFilter, newUrl})
}, [])

  return { 
    paramsFilter: state.paramsFilter,
    pageParam: state.pageParam,
    setPage,
    addtoParams
   };
};

export default useParamsFilter;
