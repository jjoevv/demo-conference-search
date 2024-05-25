import React, { useEffect, useState } from 'react'
import { getUniqueConferences } from '../utils/checkFetchedResults'
import useSearch from './useSearch'
import { useAppContext } from '../context/authContext'
import { inputOptionFilterKeyword, selectOptionFilterKeyword } from '../actions/filterActions'
import { useLocation } from 'react-router-dom'

const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const { optionsSelected, getKeyword } = useSearch()
  const [optionsFilter, setOptionsFilter] = useState([])
  const [selectOptionFilter, setSelectOptionFilter] = useState([])
  const [inputFilter, setInputFilter] = useState('')

  const {pathname} = useLocation()

  useEffect(() => {
    let transformedOptions = []
    const uniqueValues = getUniqueConferences(optionsSelected)
    transformedOptions = uniqueValues.map((item, index) => ({
      value: index + 1,
      label: pathname==='/followed' || pathname === '/yourconferences' ? getKeyword(item) : item ,
      isSelected: selectOptionFilter.some(option => option.label === item)
    }));
    setOptionsFilter(transformedOptions)
    setSelectOptionFilter(transformedOptions)
    dispatch(selectOptionFilterKeyword(transformedOptions))
  }, [optionsSelected])


  const handleChangeOptions = (selectedOptions) => {
    setSelectOptionFilter(selectedOptions);
    dispatch(selectOptionFilterKeyword(selectedOptions))
  };

  const handleInputFilterChange = (e) => {
    setInputFilter(e.target.value)
  }

  const searchInput = (keyword) => {
    const dataFilter = sessionStorage.getItem('dataFilters');
    const data = JSON.parse(dataFilter)
    if (dataFilter) {
      const result = [];

    // Duyệt qua từng danh sách object trong data
    for (const category in data) {
      const filteredObjects = data[category].filter(obj => searchInObject(obj, keyword));
      if (filteredObjects.length > 0) {
        result.push(...filteredObjects);
      }
    }
      dispatch(inputOptionFilterKeyword(result))

    }
    return []
  }

  const searchInObject = (obj, keyword) => {
    keyword = keyword.toLowerCase();
    if (typeof obj === 'string') {
      return obj.toLowerCase().includes(keyword);
    }

    if (Array.isArray(obj)) {
      return obj.some(item => searchInObject(item, keyword));
    }

    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => searchInObject(value, keyword));
    }

    return false;
  }
  return {
    optionsFilter,
    selectOptionFilter: state.optionFilter,
    inputFilter,
    resultInputFilter: state.resultKeywordFilter,
    handleChangeOptions,
    handleInputFilterChange,
    searchInput,
  }
}

export default useFilter