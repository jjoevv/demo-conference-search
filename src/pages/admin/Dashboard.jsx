import { useState, useEffect, useRef } from 'react'
import { Container, ButtonGroup, Button, Row, Col, Tabs, Tab } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
import Loading from '../../components/Loading'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faFilter, faGear } from '@fortawesome/free-solid-svg-icons'

import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useFilter from '../../hooks/useFilter'
import FilterSelected from '../../components/Filter/FilterSelected'

import AllConferences from '../../components/admin/AllConferences'
import PendingCFPs from '../../components/admin/PendingCFP'
import './../../components/admin/custom_tab.css'
import useAdmin from '../../hooks/useAdmin'
import ImportButton from '../../components/admin/ImportButton'

const Dashboard = () => {
  const { optionsSelected, getOptionsFilter } = useSearch()
  const {
    priorityKeywords,
    filterConferences,
    sortConferencesByPriorityKeyword } = useFilter()

  const [showFilter, setShowFilter] = useState(false)
  const { loading: loadingConf, conferences, selectOptionSort, displaySortList, handleSelectOptionSort, getAllConferences } = useConference()
  const { loading: loadingAdmin, pendingConferences, getAllPendingConferences } = useAdmin()
  const [key, setKey] = useState('allconf');
  const [displayConferences, setDisplayedConferences] = useState([])
  const [conferencesList, setConferenceList] = useState([]) 

  useEffect(()=>{
    getAllConferences()
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
  }, [key])

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
  console.log({displayConferences, key})
  return (
    <Container
      className='pt-5 mt-5 bg-light overflow-y-auto' style={{ paddingLeft: "300px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Dashboard</h4>
        <ButtonGroup>
          <ImportButton/>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <FontAwesomeIcon icon={faDownload} className='me-2' />
            Export file
          </Button>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <FontAwesomeIcon icon={faGear} className='me-2' />
            Setting
          </Button>
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>Total conferences:</label>
              <span className='me-2 fw-semibold'>{displayConferences.length}</span>
            </Col>
          </Row>

        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col><InputSearch /></Col>
          <Col md='auto'>
            <Button
              className={`rounded-1 border-primary-normal ${showFilter ? 'bg-beige-normal text-teal-normal' : 'bg-white text-color-black'}`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Filter
            </Button>
          </Col>
          <Col md='auto'>
            <DropdownSort
              options={["Random", "Upcoming", "Name A->Z", "Latest"]}
              onSelect={handleDropdownSelect}
            />
          </Col>
        </Row>

        {showFilter && <Filter />}

        <FilterSelected />
        {
          loadingConf ?
            <div className="my-4">
              <Loading />
            </div>
            :
            <Tabs
              id="controlled-tab-table"
              activeKey={key}
              onSelect={(k) => setKey(k)}
            >
              <Tab eventKey="allconf" title="All conferences" className='pt-2' tabClassName= 'custom-tab-update'>
                <div ref={tabContentRef} className='overflow-y-auto' >
                  <AllConferences conferences={displayConferences} />
                </div>
              </Tab>
              <Tab eventKey="userowner" title="Pending" className='pt-2' tabClassName= 'custom-tab-update'>
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

export default Dashboard