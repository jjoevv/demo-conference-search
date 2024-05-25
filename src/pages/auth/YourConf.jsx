import { useEffect, useState } from 'react'
import { Container, Image, Button } from 'react-bootstrap'

import editIcon from '../../assets/imgs/edit.png'
import AddConference from '../../components/Modals/AddConference'
import usePost from '../../hooks/usePost'
import Conference from '../../components/Conference'
import useLocalStorage from '../../hooks/useLocalStorage'

import SuccessfulModal from '../../components/Modals/SuccessModal'
import { checkExistValue, mergeConferencesByKeyword } from '../../utils/checkFetchedResults'

import Search from '../../components/Filter/Search'
import useSearch from '../../hooks/useSearch'
import useFilterStorage from '../../hooks/useFilterStorage'
import useFilter from '../../hooks/useFilter'
import Loading from '../../components/Loading'

const YourConf = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const { optionsSelected, getOptionsFilter } = useSearch()
  const { loading: loadingPost, postedConferences, getPostedConferences } = usePost()
  const { selectOptionFilter, resultInputFilter } = useFilter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useLocalStorage()
  const [check, setCheck] = useState(false)

  const [fetchParams, setFetchParams] = useState({ key: '', keyword: '' });
  const { loading: loadingFilter, dataFilters, clearKeyValues, clearAllKeywords } = useFilterStorage(fetchParams.key, fetchParams.keyword);
  const [backupDisplayConf, setBackupDisplayConf] = useState([])
  const [displayConferences, setDisplayConferences] = useState(postedConferences)

  useEffect(() => {
    getPostedConferences()
  }, [])

  useEffect(() => {
    if (!postedConferences) {
      getPostedConferences()
    }
  }, [user])

  useEffect(() => {
    getOptionsFilter("", [])
    const isAppliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    setCheck(isAppliedFilter)
    const displayList = mergeConferencesByKeyword(dataFilters, selectOptionFilter)
    const postedConf = displayList.filter(item1 => postedConferences.some(item2 => item2.id === item1.id));

    setDisplayConferences(postedConf)
    setBackupDisplayConf(postedConf)

  }, [selectOptionFilter, dataFilters, resultInputFilter, postedConferences])


  useEffect(() => {
    const commonConfs = backupDisplayConf.filter(item1 => resultInputFilter.some(item2 => item2.id === item1.id)); setDisplayConferences(commonConfs)
  }, [resultInputFilter])

  const displayConf = check ? displayConferences : postedConferences;
  const totalPagesDisplay = check ? Math.ceil(displayConf.length / 7) : Math.ceil(postedConferences.length / 7);
  const totalConfDisplay = check ? displayConf.length : postedConferences.length
  const isLoading = check ? loadingFilter : loadingPost

  const handleCheckStatus = (status, messageSuccess) => {
    setMessage(messageSuccess)
    if (status) {
      setShowAddForm(false);
      setShowSuccess(true)

    }
  }
  const handleApplyFilter = (key, keyword) => {
    setFetchParams({ key, keyword });
  };

  const handleClose = () => setShowAddForm(false);
  const handleShow = () => setShowAddForm(true);

  return (
    <Container
      fluid
      className='py-5 ' style={{ marginLeft: "350px", marginTop: "60px" }}>

      <div className='d-flex align-items-center justify-content-between pe-5 mb-4'>
        <h4 className='mb-2'>Your conferences</h4>
        <Button
          className='rounded-2 bg-blue-normal border-0 d-flex align-items-center justify-content-between px-3'
          onClick={handleShow}>
          <Image width={20} height={20} className='me-2' src={editIcon} />
          Add
        </Button>
      </div>
      <AddConference show={showAddForm} handleClose={handleClose} handleCheckStatus={handleCheckStatus} onReloadList={getPostedConferences} />
      {showSuccess && <SuccessfulModal message={message} show={showSuccess} handleClose={() => setShowSuccess(false)} />}
      
      {
        !loadingPost ?
          <>
            {
              postedConferences && postedConferences.length > 0
                ?
                <>
                  {
                    loadingPost
                      ?
                      <div className='mt-5'>
                        <Loading onReload={getPostedConferences} />
                      </div>
                      :
                      <>
                        <Search onApply={handleApplyFilter} onDelete={clearKeyValues} onClearAll={clearAllKeywords} />
                        <Conference conferencesProp={displayConf} onReloadPage={getPostedConferences} totalPages={totalPagesDisplay} totalConferences={totalConfDisplay} loading={isLoading} isPost={true} />
                      </>
                  }
                </>
                :
                <p>No conferences available.</p>
            }
          </>
          :
          <Loading onReload={getPostedConferences} />
      }

    </Container>
  )
}

export default YourConf