import {useEffect, useState} from 'react'


import Conference from '../../components/Conference/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilter from '../../hooks/useFilter'
import usePost from '../../hooks/usePost'
import Filter from '../../components/Filter/Filter'
import { useLocation } from 'react-router-dom'

const Homepage = () => {
    const { optionsSelected, getOptionsFilter} = useSearch()
    const {loading: loadingAll, conferences,  getAllConferences} = useConference()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const {pathname} = useLocation()

    const {
      priorityKeywords, 
      filterConferences, 
      sortConferencesByPriorityKeyword}= useFilter()
    

    const [displayConferences, setDisplayedConferences] = useState(conferences)

    useEffect(()=>{
      getListFollowedConferences()
      getPostedConferences()
    },[])


    useEffect(()=>{
      getOptionsFilter("", [])
      if(conferences.length === 0 || !conferences){

        getAllConferences()
      }
    }, [conferences])


  

    useEffect(()=>{
      const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
      
      if(isApliedFilter){

        const filterResult = filterConferences(conferences, optionsSelected)
        const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)
       
        setDisplayedConferences(sortConferences)
      }
      else {
        setDisplayedConferences(conferences)
      }
      
    }, [optionsSelected, conferences, priorityKeywords])
  
   
  return (
    <div style={{marginTop: "100px"}} className='overflow-x-hidden overflow-y-auto'>        
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
         onReloadPage={getAllConferences}
         loading={loadingAll}/>
    </div>
    
  )
}

export default Homepage