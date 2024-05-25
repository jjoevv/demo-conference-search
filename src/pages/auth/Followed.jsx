import { useEffect, useState } from 'react'
import { Container, } from 'react-bootstrap'
import Conference from './../../components/Conference'
import useFollow from '../../hooks/useFollow'
import useSearch from '../../hooks/useSearch'

import useLocalStorage from '../../hooks/useLocalStorage'
import Loading from '../../components/Loading'
import { checkExistValue, mergeConferencesByKeyword } from '../../utils/checkFetchedResults'

import Search from '../../components/Filter/Search'
import useFilter from '../../hooks/useFilter'
import useFilterStorage from '../../hooks/useFilterStorage'

const Followed = () => {
  const { loading: loadingFollow, listFollowed, getListFollowedConferences } = useFollow()
  const { getOptionsFilter, optionsSelected } = useSearch()
  const [check, setCheck] = useState(false)
  const { user } = useLocalStorage()

  const { selectOptionFilter, resultInputFilter } = useFilter()
  const [fetchParams, setFetchParams] = useState({ key: '', keyword: '' });
  const { loading: loadingFilter, dataFilters, clearKeyValues, clearAllKeywords } = useFilterStorage(fetchParams.key, fetchParams.keyword);
  const [backupDisplayConf, setBackupDisplayConf] = useState([])
  const [displayConferences, setDisplayConferences] = useState(listFollowed)

  useEffect(() => {
    getListFollowedConferences()
  }, [])

  useEffect(() => {
    if (!listFollowed) {
      getListFollowedConferences()
    }
  }, [user])

  useEffect(() => {
    getOptionsFilter("", [])
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    setCheck(isAppliedFilter)
    const displayList = mergeConferencesByKeyword(dataFilters, selectOptionFilter)
    const followedConf = displayList.filter(item1 => listFollowed.some(item2 => item2.id === item1.id));

    setDisplayConferences(followedConf)
    setBackupDisplayConf(followedConf)

  }, [selectOptionFilter, dataFilters, resultInputFilter, listFollowed])

  useEffect(() => {
    const commonConfs = backupDisplayConf.filter(item1 => resultInputFilter.some(item2 => item2.id === item1.id)); setDisplayConferences(commonConfs)
  }, [resultInputFilter])

  const handleApplyFilter = (key, keyword) => {
    setFetchParams({ key, keyword });
  };


  
  const displayConf = check ? displayConferences : listFollowed;
  const totalPagesDisplay = check ? Math.ceil(displayConf.length / 7) : Math.ceil(listFollowed.length / 7);
  const totalConfDisplay = check ? displayConf.length : listFollowed.length
  const isLoading = check ? loadingFilter : loadingFollow
  
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
                  <Search onApply={handleApplyFilter} onDelete={clearKeyValues} onClearAll={clearAllKeywords} />

                  <Conference conferencesProp={displayConf} onReloadPage={getListFollowedConferences} totalPages={totalPagesDisplay} totalConferences={totalConfDisplay} loading={isLoading} />
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