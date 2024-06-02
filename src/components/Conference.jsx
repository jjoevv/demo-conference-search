import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack, Row, Col } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import UnfollowIcon from './../assets/imgs/unfollow.png'
import FollowIcon from './../assets/imgs/follow.png'
import TimeIcon from './../assets/imgs/time.png'
import useFollow from '../hooks/useFollow'
import { isObjectInList } from '../utils/checkExistInList'

import useSearch from '../hooks/useSearch'
import { DropdownSort } from './DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../utils/sortConferences'

import Loading from './Loading'
import { getDateValue } from '../utils/formatDate'
import { checkExistValue } from '../utils/checkFetchedResults'
import ButtonGroupUpdate from './PostConference/ButtonGroupUpdate'
import { useNavigate } from 'react-router-dom'
import useConference from '../hooks/useConferences'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'

const Conference = ({ conferencesProp, loading, totalPages, onReload, totalConferences, isPost }) => {
    const { selectOptionSort, displaySortList, fetchData, handleGetOne, getStartEndDate, handleSelectOptionSort } = useConference()
    const { listFollowed, followConference, unfollowConference } = useFollow()
    const { optionsSelected } = useSearch()
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [isClickFollow, setIsClickFollow] = useState(false)
    const [isFetchNew, setisFetchNew] = useState(false)
    const [displayConferences, setDisplayedConferences] = useState([])
    const [currentPage, setCurrentPage] = useState([])
    const [loadingPage, setLoadingPage] = useState(false)

    const itemsPerPage = 7;
    const pagesVisited = page * itemsPerPage;

    useEffect(() => {
        setPage(0)
    }, [optionsSelected, selectOptionSort])

    useEffect(() => {
        if (selectOptionSort === "Random") {
            const sortedConf = sortByFollow(conferencesProp, listFollowed)
            const current = sortedConf.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            setCurrentPage(current)
        }
    }, [conferencesProp, listFollowed])

    useEffect(() => {
        if (selectOptionSort === "Random") {
            const current = conferencesProp.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            setCurrentPage(current)
        }
        else {            
            const sortedConferences = sortConferences(selectOptionSort, [...conferencesProp])
            const current = sortedConferences.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            setCurrentPage(current)
        }
    }, [selectOptionSort])

    
    useEffect(() => {
        //xử lý chọn page
        const updatedCheck = conferencesProp.length >= page * itemsPerPage;       
        if(updatedCheck){
            const current = conferencesProp.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            setCurrentPage(current)
            
            setLoadingPage(false)
        }
        
      }, [loadingPage, conferencesProp, page]);
    

    const handleFollow = async (id) => {
        setIsClickFollow(true)
        const status = await followConference(id)
    }


    const handleUnfollow = async (id) => {
        setIsClickFollow(true)
        const status = await unfollowConference(id)
    }
    const handlePageClick = async (event) => {
        setPage(event.selected)
        // Cuộn lên đầu danh sách khi chuyển trang
        const element = document.getElementById('conferences-render');
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'instant'
            });
        }
        setLoadingPage(true)       
    };

    const chooseConf = async (id) => {
        await handleGetOne(id)
        navigate(`/detailed-information/${id}`)
    }


    const handleDropdownSelect = (value) => {
        setPage(0)
        setDisplayedConferences(displaySortList)
        handleSelectOptionSort(value)       
    };

    const getLengthString = (string) => string.length


    if (loading) {
        return (
            <Container className='d-flex flex-column align-items-center p-0'>
                <Loading onReload={onReload} />
            </Container>
        )
    }
    return (
        <Container   id='conferences-render' className='d-flex flex-column align-items-center p-0'>

            <div className="mb-3 px-4 d-flex align-items-center justify-content-between w-100">
                <div className="h5 fw-bold ms-4 mt-2">
                    {`${totalConferences} conferences`}
                </div>
                <DropdownSort
                        options={["Random", "Upcoming", "Name A > Z", "Latest"]}
                        onSelect={handleDropdownSelect}
                    />
            </div>

            <Row>

                <Col>
                    {
                        conferencesProp && conferencesProp.length > 0
                            ?
                            <>
                            <>
                                {
                                    loadingPage ?
                                    <div className="my-4">
                                        <Loading/>
                                    </div>
                                    :
                                    <>
                                    {
                                    
                                        currentPage.map((conf) => (
                                            <Card
                                                className='my-conf-card'
                                                style={{}}
                                                id={conf.id}
                                                key={conf.id}>
                                                <Stack className='p-0 w-100' direction='horizontal'>
                                                    <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center acronym-container '>
                                                        <span className={`fw-bold ${getLengthString(conf.information.acronym) > 6 ? 'fs-6' : 'fs-4'}`}>{conf.information.acronym}</span>
                                                    </div>

                                                    <div className='w-100'>
                                                        <Card.Body className='' onClick={() => chooseConf(conf.id)}>
                                                            <Card.Title className='text-color-black'>
                                                                <div className='fw-bold d-flex align-items-center justify-content-start mt-1'>
                                                                    {
                                                                        conf.organizations.length > 0 &&
                                                                        <>
                                                                            {isUpcoming(conf.organizations[0].start_date)
                                                                                &&
                                                                                <div className='bg-yellow-normal text-light p-2 rounded-2 me-2 fs-6 fw-bold'>
                                                                                    Upcoming
                                                                                </div>
                                                                            }
                                                                        </>
                                                                    }
                                                                    <span className='fw-bold fs-5 text-justify'>{conf.information.name}</span>
                                                                </div>

                                                            </Card.Title>
                                                            <Stack direction="horizontal" gap={5}>
                                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                                    <label className='conf-data-label'>Submission Date: </label>
                                                                    <span className='conf-data'>
                                                                    {
                                                                        getDateValue("submission", conf.importantDates)?
                                                                        getDateValue("submission", conf.importantDates):
                                                                        <span className='text-secondary'>Updating...</span>
                                                                    }
                                                                    </span>
                                                                </Card.Text>

                                                                <Card.Text className='d-flex align-items-center mb-1 text-color-black'>
                                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                                    <label className='conf-data-label'>Conference Date: </label>
                                                                    <span className='conf-data'>

                                                                        <>
                                                                            {getStartEndDate(conf.organizations)}

                                                                        </>

                                                                    </span>
                                                                </Card.Text>
                                                            </Stack>
                                                            <Card.Text className='d-flex align-items-center fs-6 mt-2'>
                                                                <FontAwesomeIcon icon={faLocationPin} className='me-2 fs-5' />
                                                                {conf.organizations.length > 0 ? (
                                                                    // Nếu location không null, hiển thị giá trị của nó
                                                                    <>{conf.organizations[0].location || 'Updating...'}</>
                                                                ) : (
                                                                    // Nếu location null, hiển thị 'updating'
                                                                    <>Updating</>
                                                                )}
                                                            </Card.Text>
                                                        </Card.Body>

                                                        {
                                                            isPost
                                                                ?
                                                                <>
                                                                    <div className='d-flex justify-content-end'>
                                                                        <ButtonGroupUpdate conference={conf} />
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    {
                                                                        isObjectInList(conf.id, listFollowed)
                                                                            ?
                                                                            <Button className='icon-follow' onClick={() => handleUnfollow(conf.id)} title='Unfollow'>
                                                                                <Image src={FollowIcon} className='me-2' width={18} />
                                                                                <span>Unfollow</span>
                                                                            </Button>
                                                                            :
                                                                            <Button className='icon-follow' onClick={() => handleFollow(conf.id)}>
                                                                                <Image src={UnfollowIcon} className='me-2 ' width={18} />
                                                                                <span>Follow</span>
                                                                            </Button>
                                                                    }
                                                                </>
                                                        }

                                                    </div>

                                                </Stack>
                                            </Card>
                                        ))
                                }
                                    </>
                                }
                            </>
                            </>
                            :
                            <>
                                <p className='mt-3'>No conferences available</p>
                            </>
                    }
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        previousLabel="<"
                        onPageChange={handlePageClick}
                        forcePage={page}
                        pageRangeDisplayed={4}
                        marginPagesDisplayed={1}
                        pageCount={totalPages}
                        renderOnZeroPageCount={null}
                        containerClassName="justify-content-center pagination"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        activeClassName="active"
                        disabledClassName="disabled"
                    />
                </Col>
            </Row>
        </Container>
    )
}

export default Conference