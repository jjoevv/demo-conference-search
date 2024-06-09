import { useAppContext } from '../context/authContext'
import { addFilter, getoptionsSelected, removeFilter } from '../actions/filterActions'

import { baseURL } from './api/baseApi'
import { useState } from 'react'
import { useLocation,  } from 'react-router-dom'
import useFollow from './useFollow'
import usePost from './usePost'
import { capitalizeFirstLetter } from '../utils/formatWord'
import countriesData from '../data/countries.json'

const useSearch = () => {
  const { state, dispatch } = useAppContext()
  const { listFollowed } = useFollow()
  const { postedConferences } = usePost()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const location = useLocation()


  const sortList = (list) => {
    // Lọc các mục là các chữ cái duy nhất
    const uniqueLetters = list.filter(item => /^[A-Z]$/.test(item));
    // Lọc các mục không phải là chữ cái duy nhất
    const nonUniqueLetters = list.filter(item => !/^[A-Z]$/.test(item)).sort();

    // Sắp xếp các chữ cái duy nhất theo thứ tự bảng chữ cái
    const uniqueList = nonUniqueLetters.reduce((accumulator, currentValue) => {
      const standardizedValue = currentValue.toLowerCase(); // Chuyển đổi giá trị thành chữ thường
      if (!accumulator.includes(standardizedValue)) {
        accumulator.push(capitalizeFirstLetter(standardizedValue));
      }
      return accumulator;
    }, []);

    // Sắp xếp danh sách giá trị duy nhất theo thứ tự bảng chữ cái
    uniqueList.sort();
    // Kết hợp lại
    return [...uniqueLetters, ...uniqueList];
  };

  const getOptionsFilter = async (label, staticData) => {
    const params = ["source", "for", "acronym", "rank"];
    const existedOptions = state.filterOptions
    setLoading(true)
    if (label === "") {
      for (const param of params) {
        if (!existedOptions[param]) {
          if (param === "acronym") {
            try {

              const response = await fetch(`${baseURL}/conf/${param}`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                  },
                }
              );
              const data = await response.json();
              // Gửi action để cập nhật dữ liệu cho label hiện tại
              const sorted = sortList(data.data)
              dispatch(getoptionsSelected({ [param]: Array.from(new Set(sorted)) }));

            } catch (error) {
              console.error(`Error fetching data for ${param}:`, error);
            }
          }
          else if (param === 'source') {
            dispatch(getoptionsSelected({ [param]: ['Core2023'] }));
          }
          else {

            try {
              const response = await fetch(`${baseURL}/${param}`);
              const data = await response.json();
              // Gửi action để cập nhật dữ liệu cho label hiện tại 
              const sorted = sortList(data.data)
              dispatch(getoptionsSelected({ [param]: Array.from(new Set(sorted)) }));

            } catch (error) {
              console.error(`Error fetching data for ${param}:`, error);
            }
          }
        }

      }
    }
    else {
      const options = staticData.map(item => item.label);
      dispatch(getoptionsSelected({ [label]: options }))
    }
    setLoading(false)
  }



  const addKeywords =  (label, keywords) => {
    const ischeck= state.optionsSelected[label].includes(keywords)
    
    console.log(label, keywords, state.optionsSelected[label], ischeck)
    if (label === 'submissionDate' || label === 'conferenceDate') {
       dispatch({ type: "ADD_FILTER_DATE", payload: { label, keyword: keywords } })
    }
    else {
      if (!state.optionsSelected[label].includes(keywords[0])) {
        dispatch(addFilter(label, keywords))
        console.log('ko trung',state.optionsSelected[label], keywords )
      }
      else deleteKeyword(label, keywords[0])
    }
  }


  const deleteKeyword = (label, keyword) => {

    const updateOptionsSelected = {
      ...state.optionsSelected,
      [label]: state.optionsSelected[label].filter(item => item !== keyword),
    };

    // Xóa 1 filter trong danh sách
    dispatch({type: "REMOVE_FILTER", payload: updateOptionsSelected});

  }
  const clearKeywords = () => {    
    if (state.optionsSelected) {
      const clearedOptionsSelected = Object.fromEntries(Object.keys(state.optionsSelected).map((key) => [key, []]));
      dispatch({type: 'CLEAR_FILTERS', payload: clearedOptionsSelected})
    }
    //reset all
  }


  const getKeyword = (keyword) => {
    const parts = keyword.split('(');
    const getKeyword = parts[0].trim();
    const storedData = sessionStorage.getItem('dataFilters');

    if (!storedData) {
      return 0;
    }
    const parsedData = JSON.parse(storedData);
    const listFromStorage = parsedData[getKeyword] || [];
    let commonCount = 0

    if (location.pathname === '/followed') {
      const setToCompare = new Set(listFollowed.map(conf => conf.id));
      commonCount = listFromStorage.filter(conf => setToCompare.has(conf.id)).length;

    }
    else if (location.pathname === '/yourconferences') {
      const setToCompare = new Set(postedConferences.map(conf => conf.id));
      commonCount = listFromStorage.filter(conf => setToCompare.has(conf.id)).length;
    }
    const newKeyword = `${getKeyword} (${commonCount})`
    return newKeyword
  }

  const extractQuantity = (keyword) => {
    const regex = /\((\d+)\)/;
    // Sử dụng biểu thức chính quy để tìm kiếm giá trị trong ngoặc tròn
    const match = keyword.match(regex);

    if (match) {
      const valueInParentheses = match[1];
      return valueInParentheses;
    } else {
      return 0;
    }
  }

  const getTotalConf = (keywords) => {
    let keywordValuePairs = JSON.parse(sessionStorage.getItem('keywordFilter')) || {};
    let total = 0;

    keywords.forEach(key => {
      // Chuyển đổi giá trị thành số nguyên trước khi cộng vào tổng
      if (keywordValuePairs[key.label]) {
        total += parseInt(keywordValuePairs[key.label], 10);
      }
    });

    return total;
  }

  // Hàm để phân tích params từ URL và cập nhật optionsSelected
  const updateOptionsSelectedFromParams = (keywords) => {
    const filteredOptions = {};
    Object.keys(state.optionsSelected).forEach(key => {
      const values = state.optionsSelected[key].filter(value => keywords.includes(value));
      if (values.length > 0) {
        filteredOptions[key] = values;
      }
    });
    return filteredOptions;
  };

  function getCountryName(countryCode) {
    if (countryCode in countriesData) {
      return countriesData[countryCode].country_name;
    } else {
      for (const code in countriesData) {
        if (countriesData[code].country_code2 === countryCode || countriesData[code].country_code3 === countryCode) {
          return countriesData[code].country_name;
        }
      }
      return null
    }
  }
  const filterAndAddToParams = () => {
    const params = {};
    // Lặp qua mỗi cặp key-value trong optionsSelected
    for (const key in state.optionsSelected) {
      if (Object.prototype.hasOwnProperty.call(state.optionsSelected, key)) {
        const values = state.optionsSelected[key];

        // Nếu có ít nhất một giá trị trong mảng, thêm chúng vào params
        if (values && values.length > 0) {
          params[key] = values.join(','); // Chuyển mảng giá trị thành chuỗi, phân cách bằng dấu phẩy
        }
      }
    }

    return params;
  };

  return {
    optionsSelected: state.optionsSelected,
    filterOptions: state.filterOptions,
    page,
    loading,
    setPage,
    getOptionsFilter,
    addKeywords,
    deleteKeyword,
    clearKeywords,
    getKeyword,
    extractQuantity,
    getTotalConf,
    updateOptionsSelectedFromParams,
    getCountryName,
    filterAndAddToParams
  }
}

export default useSearch