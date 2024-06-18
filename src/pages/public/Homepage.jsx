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
import { Container, Stack } from 'react-bootstrap'
import useParamsFilter from '../../hooks/useParamsFilter'
import SlideShow from '../../components/SlideShow'

const Homepage = () => {
    const [showSlideShow, setShowSlideShow] = useState(true)
    const { optionsSelected, getOptionsFilter} = useSearch()
    const {loading: loadingAll, conferences,  getAllConferences} = useConference()
    const {getListFollowedConferences} = useFollow()
    const {getPostedConferences}= usePost()
    const location = useLocation()
    const [loadingFilter, setLoadingFilter] = useState(false)
    const [selected, setSelected] = useState(false)
    const {
      priorityKeywords, 
      filterConferences, 
      sortConferencesByPriorityKeyword}= useFilter()   

    const [displayConferences, setDisplayedConferences] = useState(conferences)
    const {pageParam, addtoParams} = useParamsFilter()

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
      addtoParams(optionsSelected, pageParam)
    }, [pageParam, optionsSelected])


    useEffect(()=>{
      setLoadingFilter(true);
      const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
      setSelected(isAppliedFilter);
    
      const applyFilter = async () => {
        if (isAppliedFilter) {
          try {
            const filterResult =  filterConferences(conferences, optionsSelected);
            const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords);
         
            setDisplayedConferences(sortConferences);
          } catch (error) {
            console.error("Error applying filter:", error);
          } finally {
            setLoadingFilter(false);
          }
        } else {
          setDisplayedConferences(conferences);
          setLoadingFilter(false);
        }
      };
    
      applyFilter();
    }, [optionsSelected, conferences, priorityKeywords]);
    
  
  
  return (
    <div style={{marginTop: "100px"}} className='overflow-x-hidden overflow-y-auto'>        
        <div className='mb-5'>
              <SlideShow />
          
        </div>
        
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
          isFilter={loadingFilter}
         />
        }
    </div>
    
  )
}

export default Homepage