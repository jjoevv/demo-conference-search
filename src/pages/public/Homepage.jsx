import {useEffect, useState} from 'react'


import SlideShow from '../../components/SlideShow'
import Conference from '../../components/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue, mergeConferencesByKeyword } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilterStorage from '../../hooks/useFilterStorage'
import Search from '../../components/Filter/Search'
import useFilter from '../../hooks/useFilter'
import HeaderNoti from '../../components/Notification/HeaderNoti'
import usePost from '../../hooks/usePost'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const { optionsSelected, getOptionsFilter} = useSearch()
    const {loading: loadingAll, conferences, totalConferences, handleGetList} = useConference()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const [check, setCheck] = useState(false)
    const [fetchParams, setFetchParams] = useState({ key: '', keyword: '' });
    const {selectOptionFilter, resultInputFilter}= useFilter()
    const { dataFilters, clearKeyValues, clearAllKeywords } = useFilterStorage(fetchParams.key, fetchParams.keyword);

    const [displayConferences, setDisplayedConferences] = useState([])
    const [backupDisplayConf, setBackupDisplayConf] = useState([])
    const [loadingFilter, setLoadingFilter] = useState(false)

    useEffect(()=>{
      handleGetList()
    }, [conferences])

    useEffect(()=>{
      getListFollowedConferences()
      getPostedConferences()
    },[])

   useEffect(()=>{
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    getOptionsFilter("", [])
    setCheck(isAppliedFilter)


    const displayList = mergeConferencesByKeyword(dataFilters, selectOptionFilter)
    

    setDisplayedConferences(displayList)
    setBackupDisplayConf(displayList)
    
    const isLoading = JSON.parse(sessionStorage.getItem('loadingFilterResult')) 
    setLoadingFilter(isLoading)
   },[selectOptionFilter, dataFilters, resultInputFilter])

   
   useEffect(()=>{
    
    const commonConfs = backupDisplayConf.filter(item1 => resultInputFilter.some(item2 => item2.id === item1.id));
   
    setDisplayedConferences(commonConfs)
   }, [resultInputFilter])

    const handleApplyFilter = (key, keyword) => {
        setFetchParams({ key, keyword });
    };

      const savedTotalPages = localStorage.getItem('totalPagesConferences');
      const savedTotalConferences = localStorage.getItem('totalConferences');
      const displayConf = check ? displayConferences : conferences;
      const totalPagesDisplay = check ? Math.ceil(displayConf.length / 7) : savedTotalPages ? parseInt(savedTotalPages, 10) : 0;
      
      const totalConfDisplay = check ? displayConf.length : savedTotalConferences ? parseInt(savedTotalConferences, 10) : 0;
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
         <Search onApply={handleApplyFilter} onDelete={clearKeyValues} onClearAll={clearAllKeywords}/>
         <Conference conferencesProp={displayConf} onReloadPage={handleGetList} totalPages={totalPagesDisplay} totalConferences={totalConfDisplay} loading={isLoading}/>
    </div>
    
  )
}

export default Homepage