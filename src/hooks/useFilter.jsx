import { useEffect, useState } from 'react'
import { getUniqueConferences } from '../utils/checkFetchedResults'
import useSearch from './useSearch'
import { useAppContext } from '../context/authContext'
import { useLocation } from 'react-router-dom'
import useLocalStorage from './useLocalStorage'

const useFilter = () => {
  const { state, dispatch } = useAppContext()
  const { optionsSelected, getKeyword } = useSearch()
  const [optionsFilter, setOptionsFilter] = useState([])
  const [selectOptionFilter, setSelectOptionFilter] = useState([])
  const [inputValue, setInputValue] = useState('')
  const {pathname} = useLocation()
  const [loading, setLoading] = useState(false)

  const [priorityKeywords, setPriorityKeywords] = useState({});
  const [selectedKeywords, setSelectedKeywords] = useState({});

  useEffect(() => {  
    let updatedPriorityKeywords = { ...state.priorityKeywords };

    Object.entries(optionsSelected).forEach(([key, keywords]) => {
        if (!(key in updatedPriorityKeywords)) {
            updatedPriorityKeywords[key] = keywords[keywords.length - 1];
        }
    });

    // Kiểm tra nếu priority keyword hiện tại đã bị xóa khỏi optionsSelected
    Object.entries(priorityKeywords).forEach(([key, priorityKeyword]) => {
      if (optionsSelected[key] && !optionsSelected[key].includes(priorityKeyword)) {
        updatedPriorityKeywords[key] = optionsSelected[key][optionsSelected[key].length - 1];
      }
    });

    // Remove keys with only one keyword
    Object.keys(updatedPriorityKeywords).forEach(key => {
      if (optionsSelected[key].length <= 1) {
        delete updatedPriorityKeywords[key];
      }
    });
    
    setPriorityKeywords(updatedPriorityKeywords);

  // Cập nhật priorityKeywords mới
  setPriorityKeywords(updatedPriorityKeywords);
  dispatch({type: 'SET_PRIORITY_KEYWORD', payload: updatedPriorityKeywords})
  }, [optionsSelected]);
   

  

  useEffect(() => {
    let keywordsWithMultipleOptions = {};
    
    Object.entries(optionsSelected).forEach(([key, keywords]) => {
      if(keywords.length > 0){
        keywordsWithMultipleOptions[key] = keywords;
      }
    });
    setSelectedKeywords(keywordsWithMultipleOptions);
    
  }, [optionsSelected])



  const handleKeywordSelection = (key, selectedValue) => {
    //choose priority keyword
    setPriorityKeywords({
      ...priorityKeywords,
      [key]: selectedValue
    });
    dispatch({type: 'SET_PRIORITY_KEYWORD', payload: {
      ...priorityKeywords,
      [key]: selectedValue
    }})
  };


  const getCountForSelectedKeyword = (countlist, keyword) => {
    return countlist[keyword.toLowerCase()] || 0;
};

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
  dispatch({type:'SET_SEARCH_RESULT', payload: results})
  return results;
};


const sortConferencesByPriorityKeyword = (conferences, prioritySelectedKeywords) => {
  // Sắp xếp hội nghị dựa trên priorityKeywords
  return conferences.sort((a, b) => {
    const priorityKeys = Object.keys(prioritySelectedKeywords);

    // Kiểm tra xem hội nghị có thỏa mãn tất cả các từ khóa ưu tiên không
    const aMatchAllKeywords = priorityKeys.every(key =>
      a.matchingKeywords[key] && a.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase())
    );
    const bMatchAllKeywords = priorityKeys.every(key =>
      b.matchingKeywords[key] && b.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase())
    );

    if (aMatchAllKeywords && !bMatchAllKeywords) {
      return -1;
    } else if (!aMatchAllKeywords && bMatchAllKeywords) {
      return 1;
    } else if (aMatchAllKeywords && bMatchAllKeywords) {
      return 0;
    } else {
      // Nếu không thể thỏa mãn tất cả, ưu tiên sắp xếp theo key và keyword được thêm vào trước trong priorityKeywords
      for (const key of priorityKeys) {
        const aMatchKeyword = a.matchingKeywords[key] && a.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase());
        const bMatchKeyword = b.matchingKeywords[key] && b.matchingKeywords[key].includes(prioritySelectedKeywords[key].toLowerCase());

        if (aMatchKeyword && !bMatchKeyword) {
          return -1;
        } else if (!aMatchKeyword && bMatchKeyword) {
          return 1;
        }
      }

      return 0; 
    }
  });
};


const countMatchingConferences = (listConferences, keywordSelected) => {
  let keywordCounts = {}; // Object to store counts of matching conferences for each keyword

  // Initialize keywordCounts with 0 for each keyword in keywordSelected
  Object.values(keywordSelected).forEach(keywords => {
    keywords.forEach(keyword => {
      keywordCounts[keyword.toLowerCase()] = 0;
    });
  });

  listConferences.forEach(conference => {
    // Iterate through each keyword in keywordSelected
    for (const [key, keywords] of Object.entries(keywordSelected)) {
      if (keywords.length > 0 && key in conference.matchingKeywords) {
        const lowerKeywords = keywords.map(keyword => keyword.toLowerCase());
        const matchingKeywords = conference.matchingKeywords[key];

        lowerKeywords.forEach(keyword => {
          // Check if keyword is included in matchingKeywords
          if (matchingKeywords.includes(keyword)) {
            // Increment keyword count
            keywordCounts[keyword]++;
          }
        });
      }
    }
  });

  return keywordCounts;
};


  return {
    loading,
    optionsFilter,
    selectOptionFilter: state.optionFilter,
    inputValue,
    inputFilter: state.inputFilter,
    resultInputFilter: state.resultKeywordFilter,
    selectedKeywords,
    priorityKeywords: state.priorityKeywords,
    resultFilter: state.resultFilter,
    getTotalConfFilter,
    getTotalPages,
    filterConferences,
    sortConferencesByPriorityKeyword,
    handleKeywordSelection,
    countMatchingConferences,
    setSelectedKeywords,
    getCountForSelectedKeyword

  }
}

export default useFilter