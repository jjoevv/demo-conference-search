import { useState, useEffect, useRef } from 'react'
import { Container, ButtonGroup, Button, Row, Col, Tabs, Tab } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
import Loading from '../../components/Loading'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import FilterSelected from '../../components/Filter/FilterSelected'

import AllConferences from '../../components/admin/AllConferences'
import PendingCFPs from '../../components/admin/PendingCFP'
import './../../components/admin/custom_tab.css'
import useAdmin from '../../hooks/useAdmin'
import ImportButton from '../../components/admin/ImportButton/ImportButton'
import ExportButton from '../../components/admin/ExportButton'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'
import FilterOffcanvas from '../../components/admin/FilterOffcanvas'

const ConferencesManagement = () => {
  const { t } = useTranslation()
  const { windowWidth } = useScreenSize()
  const { optionsSelected, getOptionsFilter } = useSearch()
  const {
    priorityKeywords,
    filterConferences,
    sortConferencesByPriorityKeyword } = useFilter()

  const [showFilter, setShowFilter] = useState(false)
  const [showFilterOffcanvas, setShowFilterOffcanvas] = useState(false)
  const { loading: loadingConf, conferences, selectOptionSort, displaySortList, handleSelectOptionSort, getAllConferences } = useConference()
  const { loading: loadingAdmin, allcolumns, pendingConferences, getAllPendingConferences } = useAdmin()
  const [key, setKey] = useState('allconf');
  const [displayConferences, setDisplayedConferences] = useState([])
  const [conferencesList, setConferenceList] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      await getAllConferences()
      setLoading(false)
    }
    fetchData()

  }, [])

  useEffect(() => {
    if (conferences.length === 0 || !conferences) {
      getAllConferences()
    }
    getOptionsFilter("", [])
    if (key === 'allconf') {
      setDisplayedConferences(conferences)
    }
  }, [conferences])

  useEffect(() => {
    if (pendingConferences.length === 0 || !pendingConferences) {
      getAllPendingConferences()
    }
    getOptionsFilter("", [])
    // console.log({pendingConferences, key})
    if (key === 'userowner') {
      setDisplayedConferences(pendingConferences)
    } else setDisplayedConferences(conferences)
  }, [pendingConferences])

  useEffect(() => {
    if (key === 'allconf') {
      setConferenceList(conferences)
      setDisplayedConferences(conferences)
    }
    else {
      setConferenceList(pendingConferences)
      setDisplayedConferences(pendingConferences)
    }
  }, [key, conferences, pendingConferences])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(conferencesList, optionsSelected)
      const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)


      setDisplayedConferences(sortConferences)
    }
    else {
      setDisplayedConferences(conferencesList)
    }

  }, [optionsSelected, conferences, pendingConferences, conferencesList, priorityKeywords])


  useEffect(() => {
    if (selectOptionSort === "Random") {
      setDisplayedConferences(conferences)
    }
    else {
      const sortedConferences = sortConferences(selectOptionSort, [...conferencesList])
      setDisplayedConferences(sortedConferences)
    }
  }, [selectOptionSort])


  const handleDropdownSelect = (value) => {
    setDisplayedConferences(displaySortList)
    handleSelectOptionSort(value)
  };


  const tabContentRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (tabContentRef.current) {
        tabContentRef.current.style.minHeight = `${window.innerHeight - tabContentRef.current.getBoundingClientRect().top - 20}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <Container className={` pt-5 overflow-hidden ${windowWidth > 768 ? 'm-5' : 'auth-container'}`}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className='fs-3'>{t('conference_management')}</h4>
        <ButtonGroup>
          <ImportButton />
          <ExportButton data={displayConferences} headers={allcolumns} />

        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>{t('total_conferences')}:</label>
              <span className='me-2 fw-semibold'>{displayConferences.length}</span>
            </Col>
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col xs={12}><InputSearch /></Col>
          <Col md='auto'>
            {/* Button hiển thị trên màn hình desktop (lg và lớn hơn) */}
            <Button
              className={`rounded-1 d-lg-block d-none border-primary-normal ${showFilter ? 'bg-beige-normal text-teal-normal' : 'bg-white text-color-black'}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} className='mx-1' />
              {t('filter')}
            </Button>

            

          </Col>
          <Col md='auto' className='d-flex justify-content-end my-2'>
          {/* Button hiển thị trên màn hình điện thoại (sm và nhỏ hơn) */}
          <Button
              className={`rounded-1 mx-2 py-1 d-lg-none border-primary-normal ${showFilter ? 'bg-beige-normal text-teal-normal' : 'bg-white text-color-black'}`}
              onClick={() => setShowFilterOffcanvas(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} className='mx-1' />
              {t('filter')}
            </Button>
            <DropdownSort
              options={["Random", "Upcoming", "Name A->Z", "Latest"]}
              onSelect={handleDropdownSelect}
            />
          </Col>
        </Row>

        {showFilter && <Filter />}
        {showFilterOffcanvas && <FilterOffcanvas showOffcanvas={showFilterOffcanvas} setShowOffcanvas={() => setShowFilterOffcanvas(!showFilterOffcanvas)} />}
        <FilterSelected />
        {
          loadingConf && loading ?
            <div className="my-4">
              <Loading />
            </div>
            :
            <Tabs
              id="controlled-tab-table"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab eventKey="allconf" title={`${t('all')} ${t('conferences')}`} className='pt-2' tabClassName='custom-tab-update'>
                <div ref={tabContentRef} className='overflow-y-auto' >
                  <AllConferences conferences={displayConferences} />
                </div>
              </Tab>
              <Tab eventKey="userowner" title={t('pending')} className='pt-2' tabClassName='custom-tab-update'>
                <div ref={tabContentRef}>
                  <PendingCFPs conferences={displayConferences} />
                </div>
              </Tab>
            </Tabs>

        }



      </div>
    </Container>
  )
}

export default ConferencesManagement