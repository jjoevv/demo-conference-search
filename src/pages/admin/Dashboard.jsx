import React, { useState, useEffect, useRef } from 'react'
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
import { faArrowUpRightFromSquare, faDownload, faFilter, faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
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
  const { optionsSelected, getOptionsFilter } = useSearch()
  const {
    priorityKeywords,
    filterConferences,
    sortConferencesByPriorityKeyword } = useFilter()

  const [showFilter, setShowFilter] = useState(false)
  const { loading: loadingConf, conferences, selectOptionSort, displaySortList, handleSelectOptionSort, handleGetList, handleGetOne, getAllConferences } = useConference()
  const [displayConferences, setDisplayedConferences] = useState([])

  const [showUpdateConf, setShowUpdate] = useState(false)
  const [showDeleteConf, setShowDelete] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const { loading, deletePost, getPostedConferences } = usePost()
  const scrollPositions = useRef({});
  const [countdown, setCountdown] = useState(3);
  const [isConfirm, setIsConfirm] = useState(false)

  const [conferenceUpdate, setConferenceUpdate] = useState(null)

  useEffect(() => {
    if (conferences.length === 0 || !conferences) {
      getAllConferences()
    }
    getOptionsFilter("", [])
    setDisplayedConferences(conferences)
  }, [conferences])

  useEffect(() => {
    const isApliedFilter = checkExistValue(optionsSelected).some(value => value === true);

    if (isApliedFilter) {

      const filterResult = filterConferences(conferences, optionsSelected)
      const sortConferences = sortConferencesByPriorityKeyword(filterResult, priorityKeywords)


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
  const handleChooseCfp = async (conf) => {
    // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
    scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
    // Cập nhật URL với trang mới
    const newUrl = new URL(window.location);
    window.history.pushState({}, '', newUrl);

    navigate(`/detailed-information/${conf.id}`)
  }


  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        Cell: ({ row }) => (
          <div className='position-sticky'>{row.index + 1}</div>
        ),
        id: 'index',
        width: 40,
        disableResizing: true
      },
      {
        Header: 'Name',
        accessor: 'information.name',
        width: 400
      },
      {
        Header: 'Acronym',
        accessor: 'information.acronym',
        width: 100,
        disableResizing: true
      },
      {
        Header: 'Source',
        accessor: 'information.source',
        width: 100,
        disableResizing: true
      },
      {
        Header: 'Rank',
        accessor: 'information.rank',
        width: 150,
        disableResizing: true
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
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            return capitalizeFirstLetter(newOrganizations[0].type);
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        width: 100,
        disableResizing: true
      },
      // Định nghĩa cột "Conference date"
      {
        Header: 'Conference date',
        accessor: (row) => {
          const newOrganizations = row.organizations.filter(org => org.status === 'new');
          if (newOrganizations.length > 0) {
            const startDate = newOrganizations[0].start_date;
            const endDate = newOrganizations[0].end_date;
            return endDate ? `${moment(startDate).format('YYYY/MM/DD')} - ${moment(endDate).format('YYYY/MM/DD')}` : startDate;
          } else {
            return ''; // Hoặc giá trị mặc định khác nếu không có tổ chức nào có status là "new"
          }
        },
        id: 'conference_date',
        width: 200
      },

      {
        Header: 'Action',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className='fixed-column p-0 d-flex align-items-center justify-content-center'>
            <Button className='bg-transparent  p-0 mx-2 my-0 border-0 action-btn tb-icon-view  '
              onClick={() => handleChooseCfp(row.original)}
              title='View CFP'
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='text-primary-normal action-icon' />
              </Button>

            <Button className='bg-transparent border-0 p-0  my-0 action-btn tb-icon-delete ' 
            onClick={() => handleChooseDelete(row.original)}>
              <FontAwesomeIcon icon={faTrash} className='text-danger action-icon' />
            </Button>


          </div>
        ),
        disableResizing: true,
      },

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
            <TableRender data={displayConferences} columns={columns} />
        }

        {showDeleteConf &&
          <DeleteModal
            show={showDeleteConf}
            onClose={() => setShowDelete(!showDeleteConf)}
            onConfirm={handleDeletePost}
            modalTitle={'conference'}
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
            onClose={() => setShowUpdate(!showUpdateConf)}
            onUpdatePost={getPostedConferences}
          />}
      </div>
    </Container>
  )
}

export default Dashboard