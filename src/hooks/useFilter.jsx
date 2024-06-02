import { useEffect, useState } from 'react'
import { getUniqueConferences } from '../utils/checkFetchedResults'
import useSearch from './useSearch'
import { useAppContext } from '../context/authContext'
import { inputOptionFilterKeyword, selectOptionFilterKeyword } from '../actions/filterActions'
import { useLocation } from 'react-router-dom'
import useConference from './useConferences'
import useLocalStorage from './useLocalStorage'

const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const {conferences} = useConference()
  const { optionsSelected, getKeyword } = useSearch()
  const {getItemInLocalStorage} = useLocalStorage()
  const [optionsFilter, setOptionsFilter] = useState([])
  const [selectOptionFilter, setSelectOptionFilter] = useState([])
  const [inputValue, setInputValue] = useState('')
  const {pathname} = useLocation()
  const [loading, setLoading] = useState(false)
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
    setInputValue(e.target.value)
  }

  const searchInput = (keyword) => {
    dispatch({ type: 'SET_INPUT_OPTION_FILTER', payload: keyword});
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

  const getTotalConfFilter = () => {
      const savedTotalPages = localStorage.getItem('totalConf');
      return savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
  }
  const getTotalPages = () => {
    const savedTotalPages = localStorage.getItem('totalConf');
    return savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
}

const filterConferences = (listConferences, keywordSelected) => {
  setLoading(true);
  let results = [];

  listConferences.forEach(conference => {
    let matchKeywords = {}; // Object to store matching keywords for each key

    let isOverallMatch = true;

    // Iterate through each category in keywordSelected
    for (const [key, keywords] of Object.entries(keywordSelected)) {
      if (keywords.length > 0) {
        const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());
        let isCategoryMatch = false;

        lowerKeywords.forEach(keyword => {
          let isMatch = false;

          switch (key) {
            case 'location': {
              isMatch = conference.organizations?.some(org => org.location?.toLowerCase().includes(keyword));
              break;
            }

            case 'rank': {
              isMatch = conference.information?.rank?.toLowerCase().includes(keyword);
              break;
            }

            case 'for': {
              isMatch = conference.information?.fieldOfResearch?.some(field => field?.toLowerCase().includes(keyword));
              break;
            }

            case 'source': {
              isMatch = conference.information?.source?.toLowerCase().includes(keyword);
              break;
            }

            case 'acronym': {
              isMatch = conference.information?.acronym?.toLowerCase().includes(keyword);
              break;
            }

            case 'type': {
              isMatch = conference.organizations?.some(org => org.type?.toLowerCase().includes(keyword));
              break;
            }

            case 'conferenceDate': {
              const matchDates = keyword.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
              if (matchDates) {
                const startDate = new Date(matchDates[1]);
                const endDate = new Date(matchDates[2]);
                isMatch = conference.organizations?.some(org => {
                  const dateValue = new Date(org.start_date);
                  return dateValue >= startDate && dateValue <= endDate && org.status === "new";
                });
              }
              break;
            }

            case 'submissionDate': {
              const matchSubDates = keyword.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
              if (matchSubDates) {
                const startDate = new Date(matchSubDates[1]);
                const endDate = new Date(matchSubDates[2]);
                isMatch = conference.importantDates?.some(date => {
                  const dateValue = new Date(date.date_value);
                  return date.date_type?.toLowerCase().includes('sub') &&
                         dateValue >= startDate && dateValue <= endDate &&
                         date.status === "new";
                });
              }
              break;
            }

            case 'search': {
              isMatch = searchInObject(conference, keyword);
              break;
            }

            case 'impactfactor': {
              isMatch = conference.information?.impactfactor?.toLowerCase().includes(keyword);
              break;
            }

            case 'rating': {
              const matchRating = keyword.match(/\d+/);
              if (matchRating) {
                const threshold = parseFloat(matchRating[0]);
                isMatch = conference.information?.rating >= threshold;
              }
              break;
            }

            case 'category': {
              isMatch = conference.information?.fieldOfResearch?.some(field => field?.toLowerCase().includes(keyword));
              break;
            }

            default:
              break;
          }

          if (isMatch) {
            if (!matchKeywords[key]) matchKeywords[key] = [];
            matchKeywords[key].push(keyword);
            isCategoryMatch = true;
          }
        });

        if (!isCategoryMatch) {
          isOverallMatch = false;
          break;
        }
      }
    }

    if (isOverallMatch) {
      conference.matchingKeywords = matchKeywords;
      results.push(conference);
    }
  });

  setLoading(false);
  return results;
};





  return {
    loading,
    optionsFilter,
    selectOptionFilter: state.optionFilter,
    inputValue,
    inputFilter: state.inputFilter,
    resultInputFilter: state.resultKeywordFilter,
    handleChangeOptions,
    handleInputFilterChange,
    searchInput,
    getTotalConfFilter,
    getTotalPages,
    filterConferences
  }
}

export default useFilter