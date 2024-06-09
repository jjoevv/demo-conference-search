import {useEffect, useRef, useState} from 'react'


import Conference from '../../components/Conference/Conference'


import useSearch from '../../hooks/useSearch'
import useConference from '../../hooks/useConferences'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFollow from '../../hooks/useFollow'
import useFilter from '../../hooks/useFilter'
import usePost from '../../hooks/usePost'
import Filter from '../../components/Filter/Filter'
import { useLocation, useParams } from 'react-router-dom'
import LoadingConferences from '../../components/Conference/LoadingConferences'
import { Container } from 'react-bootstrap'
import useParamsFilter from '../../hooks/useParamsFilter'

const Homepage = () => {
    const { optionsSelected, getOptionsFilter} = useSearch()
    const {loading: loadingAll, conferences,  getAllConferences} = useConference()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const {pathname} = useLocation()
    const params = useParams()
    const {
      priorityKeywords, 
      filterConferences, 
      sortConferencesByPriorityKeyword}= useFilter()   

    const [displayConferences, setDisplayedConferences] = useState(conferences)


    const {pageParam, addtoParams} = useParamsFilter(optionsSelected)
    useEffect(()=>{
      getListFollowedConferences()
      getPostedConferences()
    },[])


    useEffect(()=>{
     // console.log({loadingAll})
      getOptionsFilter("", [])
      if(conferences.length === 0 || !conferences){
        getAllConferences()
      }
    }, [conferences])


    useEffect(()=>{
      addtoParams(optionsSelected)
      console.log({params})
    }, [pageParam, optionsSelected])
  

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
        {
          loadingAll ?
          <Container fluid className='d-flex flex-column align-items-center vh-100 p-0 overflow-hidden'>
          <LoadingConferences onReload={getAllConferences} />
      </Container>
          :
          <Conference 
          conferencesProp={displayConferences} 
          onReloadPage={getAllConferences}
          loading={loadingAll}
         />
        }
    </div>
    
  )
}

export default Homepage