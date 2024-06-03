import {useEffect, useState} from 'react'


import Conference from '../../components/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilter from '../../hooks/useFilter'
import usePost from '../../hooks/usePost'
import Filter from '../../components/Filter/Filter'
import useLocalStorage from '../../hooks/useLocalStorage'
import { useLocation } from 'react-router-dom'

const Homepage = () => {
    const { optionsSelected, getOptionsFilter, updateOptionsSelectedFromParams} = useSearch()
    const {loading: loadingAll, conferences, handleGetList} = useConference()
    const {getItemInLocalStorage} = useLocalStorage()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const {pathname} = useLocation()
    const {
      priorityKeywords, 
      filterConferences, 
      sortConferencesByPriorityKeyword}= useFilter()
    

    const [displayConferences, setDisplayedConferences] = useState(conferences)
    const [totalConferences, setTotalConferences] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(()=>{
      getOptionsFilter("", [])
      if(conferences.length === 0 || !conferences){
        handleGetList()
      }
      const totalConfLS = getItemInLocalStorage('totalConferences')
      const totalPagesLS = getItemInLocalStorage('totalPagesConferences')
      setTotalConferences(totalConfLS)
      setTotalPages(Math.ceil(totalPagesLS))
      setDisplayedConferences(conferences)
    }, [conferences])


    useEffect(()=>{
      getListFollowedConferences()
      getPostedConferences()
    },[])
  

    useEffect(()=>{
      const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
      
      if(isApliedFilter){

        const filterResult = filterConferences(conferences, optionsSelected)
        const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)
  
        setDisplayedConferences(sortConferences)
        setTotalConferences(filterResult.length)
        setTotalPages(Math.ceil(filterResult.length / 7))
      }
      else {
        const totalConfLS = getItemInLocalStorage('totalConferences')
        const totalPagesLS = getItemInLocalStorage('totalPagesConferences')
        setTotalConferences(totalConfLS)
        setTotalPages(Math.ceil(totalPagesLS))
        setDisplayedConferences(conferences)
      }
      
    }, [optionsSelected, conferences, priorityKeywords])
  
    useEffect(()=>{
      console.log({pathname, optionsSelected})
    }, [pathname, optionsSelected])

   
  return (
    <div style={{marginTop: "100px"}} className='overflow-x-hidden'>        
        {/*showSlideShow &&
        <Container>
          <Stack direction='horizontal' className='w-100'>
            <SlideConferences showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
            <SlideShow showSlideShow={showSlideShow} setShowSlideShow={setShowSlideShow}/>
          </Stack>
  </Container>*/}
         <Filter />
         <Conference 
         conferencesProp={displayConferences} 
         onReloadPage={handleGetList} 
         totalPages={totalPages} 
         totalConferences={totalConferences} 
         loading={loadingAll}/>
    </div>
    
  )
}

export default Homepage