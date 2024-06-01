import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue, getUniqueConferences, mergeConferencesByKeyword } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilterStorage from '../../hooks/useFilterStorage'
import Search from '../../components/Filter/Search'
import useFilter from '../../hooks/useFilter'
import usePost from '../../hooks/usePost'
import useSearchKeyword from '../../hooks/useSearchKeyword'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const { optionsSelected,actionWithKeyword, getOptionsFilter, getTotalConf} = useSearch()
    const {loading: loadingAll, conferences, handleGetList} = useConference()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const [check, setCheck] = useState(false)
    const [fetchParams, setFetchParams] = useState({ key: '', keyword: '' });
    const {selectOptionFilter, resultInputFilter, inputFilter}= useFilter()
    const {loading: loadingSearch,  dataFilters, clearKeyValues, clearAllKeywords } = useFilterStorage(fetchParams.key, fetchParams.keyword);

    const [displayConferences, setDisplayedConferences] = useState(conferences)
    const [backupDisplayConf, setBackupDisplayConf] = useState([])
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [totalConferences, setTotalConferences] = useState(0);
     const [totalPages, setTotalPages] = useState(0);



    const {resultFilter,loading: loadingSearchKeyword, generateURL, fetchAllPages} = useSearchKeyword()

    useEffect(()=>{
      if(conferences.length === 0 || !conferences){
        handleGetList()
      }

      if(!check){
        setDisplayedConferences(conferences)
      }
    }, [conferences])


    useEffect(()=>{
      getListFollowedConferences()
      getPostedConferences()
    },[])
  

    useEffect(()=>{
      const url = generateURL(optionsSelected)
      const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
      setCheck(isAppliedFilter)
      if(isAppliedFilter){
        fetchAllPages(url)
      }
    }, [optionsSelected])
 
   

   useEffect(()=>{
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    getOptionsFilter("", [])
    setCheck(isAppliedFilter)
    
    if(isAppliedFilter){
      
      const displayList = mergeConferencesByKeyword(dataFilters, selectOptionFilter)

      setDisplayedConferences(displayList)
      setBackupDisplayConf(resultFilter)
      
      const isLoading = JSON.parse(sessionStorage.getItem('loadingFilterResult')) 
      setLoadingFilter(isLoading)
      let totalConf = 0
      let pagesCount = 0
  
      if(inputFilter !== ''){
        const commonConfs = displayList.filter(item1 => resultInputFilter.some(item2 => item2.id === item1.id)); 
        setDisplayedConferences(commonConfs)
        
      
        totalConf = commonConfs.length  
        pagesCount = Math.ceil(totalConf / 7)        
      }
      else{
        if(optionsSelected['category'].length>0){
          const savedTotalPages = localStorage.getItem('totalPagesConferences');
          const savedTotalConferences = localStorage.getItem('totalConferencesSearch');
          totalConf = savedTotalConferences ? parseInt(savedTotalConferences, 10) : 0
          pagesCount = savedTotalPages ? parseInt(savedTotalPages, 10) : 0
        }
        else{
          totalConf = getTotalConf(selectOptionFilter)
          pagesCount = Math.ceil(totalConf / 7)
        }
  
      }
      setTotalConferences(totalConf)
      setTotalPages(pagesCount)
    }
    else {
      const savedTotalPages = localStorage.getItem('totalPagesConferences');
      const savedTotalConferences = localStorage.getItem('totalConferences');
      setDisplayedConferences(conferences)
      setTotalConferences(savedTotalConferences ? parseInt(savedTotalConferences, 10) : 0)
      setTotalPages(savedTotalPages ? parseInt(savedTotalPages, 10) : 0)
    }

   },[selectOptionFilter, dataFilters, resultInputFilter, inputFilter])

    const handleApplyFilter = (key, keyword) => {
        setFetchParams({ key, keyword });
    };

      const isLoading = check ? loadingFilter : loadingAll
  return (
    <div style={{marginTop: "100px"}}>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
         <Search onApply={handleApplyFilter} onDelete={clearKeyValues} onClearAll={clearAllKeywords} loading={loadingSearch}/>
         <Conference 
         conferencesProp={displayConferences} 
         onReloadPage={handleGetList} 
         totalPages={totalPages} 
         totalConferences={totalConferences} 
         loading={isLoading}/>
    </div>
    
  )
}

export default Homepage