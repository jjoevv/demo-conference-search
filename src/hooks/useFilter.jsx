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
  setLoading(true)
    const result =  listConferences.filter(conference => {
      // Kiểm tra từng trường trong optionsSelected
      for (const [key, keywords] of Object.entries(keywordSelected)) {
        if (keywords.length > 0) {
          // Chuyển tất cả các từ khóa về chữ thường
          const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());
  
          // Tùy thuộc vào key, kiểm tra giá trị tương ứng trong conference
          let isMatch = false;
          switch (key) {
            case 'location':
              isMatch = lowerKeywords.every(keyword => 
                conference.organizations?.some(org => org.location?.toLowerCase().includes(keyword))
              );
              break;
            case 'rank':
              isMatch = lowerKeywords.every(keyword => 
                conference.information?.rank?.toLowerCase().includes(keyword)
              );
              break;
            case 'for': // Assuming 'for' corresponds to fieldOfResearch
              isMatch = lowerKeywords.every(keyword => 
                conference.information?.fieldOfResearch?.some(field => field?.toLowerCase().includes(keyword))
              );
              break;
            case 'source':
              isMatch = lowerKeywords.every(keyword => 
                conference.information?.source?.toLowerCase().includes(keyword)
              );
              break;
            case 'acronym':
              isMatch = lowerKeywords.every(keyword => 
                conference.information?.acronym?.toLowerCase().includes(keyword)
              );
              break;
            case 'type':
              isMatch = lowerKeywords.every(keyword => 
                conference.organizations?.some(org => org.type?.toLowerCase().includes(keyword))
              );
              break;
            case 'conferenceDate':
              isMatch = lowerKeywords.every(keyword => {
                // Tìm ngày bắt đầu và kết thúc từ keyword
                const matchDates = keyword.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
                if (matchDates && matchDates.length === 3) {
                  const startDate = new Date(matchDates[1]);
                  const endDate = new Date(matchDates[2]);
                  // Kiểm tra mỗi ngày trong importantDates của conference
                  return conference.organizations?.some(org => {
                    const dateValue = new Date(org.start_date);
                    return (
                      dateValue &&
                      dateValue >= startDate && // Ngày bắt đầu
                      dateValue <= endDate && // Ngày kết thúc
                      org.status === "new" // Kiểm tra status
                    );
                  });
                }
                return false; // Trả về false nếu không tìm thấy ngày
              });
              break;
            case 'submissionDate':
              isMatch = lowerKeywords.every(keyword => {
                // Tìm ngày bắt đầu và kết thúc từ keyword
                const matchDates = keyword.match(/from\s+(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
                if (matchDates && matchDates.length === 3) {
                  const startDate = new Date(matchDates[1]);
                  const endDate = new Date(matchDates[2]);
            
                  // Kiểm tra mỗi ngày trong importantDates của conference
                  return conference.importantDates?.some(date => {
                    const dateValue = new Date(date.date_value);
                    return (
                      date.date_type?.toLowerCase().includes('sub') &&
                      dateValue >= startDate && // Ngày bắt đầu
                      dateValue <= endDate && // Ngày kết thúc
                      date.status === "new" // Kiểm tra status
                    );
                  });
                }
                return false; // Trả về false nếu không tìm thấy ngày
              });
              break;
            
            case 'search':
              isMatch = lowerKeywords.every(keyword => 
                searchInObject(conference, keyword)
              );
              break;
            case 'impactfactor': // Assuming impact factor is in the information
              isMatch = lowerKeywords.every(keyword => 
                conference.information?.impactfactor?.toLowerCase().includes(keyword)
              );
              break;
            case 'rating':
              isMatch = lowerKeywords.every(keyword => {
                
              const matchRating = keyword.match(/\d+/);
              let rating = 0
              // Nếu tìm thấy số, trả về giá trị đầu tiên tìm thấy
              if (matchRating && matchRating.length > 0) {
                  rating = parseInt(matchRating[0]);
                  const threshold = parseFloat(rating);
                  return conference.information?.rating >= threshold;
              }
              }
              );
              break;
            case 'category': // Assuming category corresponds to fieldOfResearch
              isMatch = true
              break;
            default:
              break;
          }
          if (!isMatch) return false; // Nếu không khớp bất kỳ từ khóa nào, bỏ qua hội nghị này
        }
      }
      
      return true; // Nếu tất cả các từ khóa đều khớp
    });
    setLoading(false)
    return result
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