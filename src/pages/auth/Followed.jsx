import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from '../../components/Conference/Conference'
import useFollow from '../../hooks/useFollow'
import useSearch from '../../hooks/useSearch'

import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'


import useFilter from '../../hooks/useFilter'
import Filter from '../../components/Filter/Filter'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useSessionStorage from '../../hooks/useSessionStorage'

const Followed = () => {
  const { loading: loadingFollow, listFollowed, getListFollowedConferences } = useFollow()
  const { getOptionsFilter, optionsSelected } = useSearch()
  const {getDataListInStorage} = useSessionStorage()
  const { user } = useLocalStorage()

  const { filterConferences } = useFilter()
  
  
  const [displayConferences, setDisplayConferences] = useState(listFollowed)
  const [totalConferences, setTotalConferences] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    
    getOptionsFilter("", [])
    getListFollowedConferences()
  }, [])

  useEffect(() => {
    if (!listFollowed) {
      getListFollowedConferences()
      setDisplayConferences(listFollowed)
    }
  }, [user])

  useEffect(()=>{
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    if(isApliedFilter){

      const filterResult = filterConferences(listFollowed, optionsSelected)
      setDisplayConferences(filterResult)
      
    }
    else {
      setDisplayConferences(listFollowed)
    }
    // Tạo query string 
    const queryString  = Object.entries(optionsSelected)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) => `${key}=${values.join(',')}`)
    .join('&');
     // Lấy phần hash của URL nếu có
     const { hash, pathname } = window.location;
     const newUrl = queryString ? `${pathname}${hash}?${queryString}` : `${pathname}${hash}`;
     
     // Cập nhật URL
     window.history.pushState({}, '', newUrl);
  }, [optionsSelected, listFollowed])

  return (
    <Container
      fluid
      className='py-5 ' style={{ marginLeft: "350px", marginTop: "60px" }}>
      <h4 className=''>Followed Conference</h4>
      <h6>{`Review the list of events you previously saved. Pay attention to the time so you don't miss it.`}</h6>

      {
        !loadingFollow ?
          <>
            {
              listFollowed && listFollowed.length > 0
                ?
                <>
                 <Filter/>

                  <Conference 
                    conferencesProp={displayConferences} 
                    onReloadPage={getListFollowedConferences} 
                    loading={loadingFollow} />
                </>
                :
                <p>{`You haven't followed any conferences yet. `}</p>
            }
          </>
          :
          <div className='mt-5'>
            <Loading onReload={getListFollowedConferences} />
          </div>
      }


    </Container>
  )
}

export default Followed