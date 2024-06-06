import React, { useState, useEffect } from 'react'
import { Container, ButtonGroup, Button, Image, Row, Col } from 'react-bootstrap'

import InputSearch from '../../components/admin/InputSearch'
import Filter from '../../components/admin/Filter'
import useConference from '../../hooks/useConferences'
import { sortConferences } from '../../utils/sortConferences'
import { DropdownSort } from '../../components/DropdownSort'
import Loading from '../../components/Loading'
import TableRender from '../../components/admin/TableRender'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faFilter, faTrash } from '@fortawesome/free-solid-svg-icons'
import usePost from '../../hooks/usePost'
import DeleteModal from '../../components/Modals/DeleteModal'
import ModalUpdateConf from '../../components/UpdatePost.jsx/ModalUpdateConf'
import useSearch from '../../hooks/useSearch'
import { checkExistValue } from '../../utils/checkFetchedResults'
import useLocalStorage from '../../hooks/useLocalStorage'
import useFilter from '../../hooks/useFilter'
import FilterSelected from '../../components/Filter/FilterSelected'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
  const navigate = useNavigate()
  const { optionsSelected, getOptionsFilter} = useSearch()
  const {
    priorityKeywords, 
    filterConferences, 
    sortConferencesByPriorityKeyword}= useFilter()

  const [showFilter, setShowFilter] = useState(false)
  const { loading: loadingConf, conferences, selectOptionSort, displaySortList, handleSelectOptionSort, handleGetList, handleGetOne } = useConference()
  const [displayConferences, setDisplayedConferences] = useState([])

  const [showUpdateConf, setShowUpdate] = useState(false)
  const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const {loading, deletePost, getPostedConferences} = usePost()

  const [countdown, setCountdown] = useState(3);
  const [isConfirm, setIsConfirm] = useState(false)
  
  const [conferenceUpdate, setConferenceUpdate] = useState(null)
  useEffect(() => {
    if(conferences.length === 0 || !conferences){
      handleGetList()
    }
    getOptionsFilter("", [])
    setDisplayedConferences(conferences)
  }, [conferences])

  useEffect(()=>{
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);
    
    if(isApliedFilter){

      const filterResult = filterConferences(conferences, optionsSelected)
      const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)
      //console.log({sortConferences})
      setDisplayedConferences(sortConferences)
    }
    else {
      setDisplayedConferences(conferences)
    }
    
  }, [optionsSelected, conferences, priorityKeywords])


  useEffect(() => {
    if (selectOptionSort === "Random") {
        setDisplayedConferences(conferences)
    }
    else {
        const sortedConferences = sortConferences(selectOptionSort, [...conferences])
        setDisplayedConferences(sortedConferences)
    }
}, [selectOptionSort])


  const handleDropdownSelect = (value) => {
        setDisplayedConferences(displaySortList)
        handleSelectOptionSort(value)
  };
  const handleClose = () => {
      setShowDelete(false);
      setStatus(null);
      setMessage('');
      setCountdown(3);
    };

  const handleChooseEdit = (conf) => {
    setConferenceUpdate(conf)
    setShowUpdate(true)
  }

  const handleChooseDelete = (conf) => {
    setConferenceUpdate(conf)
    setShowDelete(true)
  }
  const handleDeletePost = async () => {
      setIsConfirm(true)
      const result = await deletePost(conferenceUpdate.id);
      setStatus(result.status);
      setMessage(result.message);
      if (result.status) {
        getPostedConferences()
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 0) {
              clearInterval(countdownInterval);
              handleClose();
              return 0;
            }
            return prevCountdown - 1;
          });
        }, 1000); // Giảm mỗi 1 giây
      }
  }
  const handleChooseCfp = async (id) => {
    await handleGetOne(id)
  //  navigate(`/admin/dashboard/${id}`)
  }


  const columns = React.useMemo(
    () => [
        {
            Header: () => (
                <div className="d-flex fixed-column-1">
                    <div className="border-start border-end" style={{width: '80px'}}>{`Actions`}</div>
                    <div className="border-start border-end">Status</div>
                    <div className="border-start ">Owner</div>
                </div>
            ),
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className='fixed-column-1 p-0 d-flex align-items-center'>
                    <ButtonGroup style={{width: '80px'}}>
                        <Button className='bg-transparent border-0 p-0 m-0' onClick={() => handleChooseEdit(row.original)}>
                            <FontAwesomeIcon icon={faEdit} className='text-primary-normal' />
                        </Button>

                        <Button className='bg-transparent border-0 p-0 m-0'    onClick={()=>handleChooseDelete(row.original)}>
                            <FontAwesomeIcon icon={faTrash} className='text-danger' />
                        </Button>
                    </ButtonGroup>

                    <div className='border-start border-end'>
                        {row.original.information.status ? "Active" : "Inactive"}   
                    </div>
                    <div>
                        {capitalizeFirstLetter(row.original.information.owner)}    
                    </div>
                </div>
            ),
            width: 300,
            disableResizing: false,
        },
        {
            Header: 'Name',
            accessor: 'information.name',
            width: 400
        },
        {
            Header: 'Acronym',
            accessor: 'information.acronym',
            width: 100
        },
        {
            Header: 'Source',
            accessor: 'information.source',
            width: 100
        },
        {
            Header: 'Rank',
            accessor: 'information.rank',
            width: 50,

        },
        {
            Header: 'Field of Research',
            accessor: 'information.fieldOfResearch[0]',
            width: 200
        },
        {
            Header: 'Location',
            accessor: 'organizations[0].location',
            width: 200
        },
        {
            Header: 'Type',
            accessor: (row)=>capitalizeFirstLetter(row.organizations[0].type),
            width: 100
        },
        {
            Header: 'Conference date',
            accessor: (row) => `${row.organizations[0].start_date} ${row.organizations[0].end_date?`- ${row.organizations[0].end_date}`:''}`,
            id: 'conference_date',
            width: 200
        },
        {
            Header: 'Crawl date',
            accessor: (row)=> moment(row.createdAt).format('YYYY/MM/DD,  h:mm:ss'),
            width: 200
        },
        {
            Header: 'Update date',
            accessor: (row)=> moment(row.updateAt).format('YYYY/MM/DD,  h:mm:ss'),
            width: 200
        }
    ],
    []
);
  return (
    <Container
      fluid
      className='pt-5 mt-5 bg-light overflow-y-auto' style={{ paddingLeft: "350px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Dashboard</h4>
        <ButtonGroup>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Export file
          </Button>
          <Button className='bg-white text-color-black fw-medium d-flex align-items-center border border-0'>
            <Image src className='p-2' />
            Setting
          </Button>
        </ButtonGroup>
      </div>

      <div className='p-3 bg-white rounded'>
        <span className='fw-semibold text-color-medium'>Common</span>
        <div className="pb-3 border-bottom border-primary-light">

          <Row>
            <Col>
              <label className='me-2'>Crawled web pages:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Recent data crawling time:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Data crawling cycle:</label>
              <span className='me-2 fw-semibold'>Every 3 days</span>
            </Col>
          </Row>

          <Row>
            <Col>
              <label className='me-2'>Crawled conferences:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col>
              <label className='me-2'>Success rate of the crawl process:</label>
              <span className='me-2 fw-semibold'>2000</span>
            </Col>
            <Col></Col>
          </Row>
        </div>

        <Row md={4} className='justify-content-end my-2 mb-3'>
          <Col><InputSearch /></Col>
          <Col md='auto'>
            <Button
              className='bg-white text-color-black rounded-1'
              onClick={() => setShowFilter(!showFilter)}
            >
              <FontAwesomeIcon icon={faFilter}/>
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
        
        <FilterSelected/>
        {
          loadingConf ?
          <div className="my-4">
            <Loading/>
          </div>
          :
          <TableRender data={displayConferences} columns={columns}/>
        }

          {showDeleteConf && 
            <DeleteModal
            show={showDeleteConf} 
            onClose={()=>setShowDelete(!showDeleteConf)}
            onConfirm={handleDeletePost}
            modalTitle = {'conference'}
            message={message}
            status={status}
            loading={loading}
            countdown={countdown}
            isConfirm={isConfirm}
            />}

            {showUpdateConf && 
            <ModalUpdateConf
                conference={conferenceUpdate}
                show={showUpdateConf}    
                onClose={()=>setShowUpdate(!showUpdateConf)}
                onUpdatePost={getPostedConferences}
            />}
      </div>
    </Container>
  )
}

export default Dashboard