import { useEffect, useState } from 'react'
import { Container, Card, Button, Stack, Row, Col, Image } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'

import useSearch from '../../hooks/useSearch'
import { DropdownSort } from '../DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../../utils/sortConferences'

import Loading from '../Loading'
import { getDateValue, getSubDate } from '../../utils/formatDate'
import ButtonGroupUpdate from '../PostConference/ButtonGroupUpdate'
import { useNavigate } from 'react-router-dom'
import useConference from '../../hooks/useConferences'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faLocationPin } from '@fortawesome/free-solid-svg-icons'
import UnFollowIcon from './../../assets/imgs/unfollow.png'
import FollowIcon from './../../assets/imgs/follow.png'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import PriorityOptions from '../Filter/PriorityOptions'
import LoadingConferences from './LoadingConferences'
import moment from 'moment'

const Conference = ({ conferencesProp, loading, totalPages, onReload, totalConferences, isPost }) => {
    const { selectOptionSort, displaySortList, handleGetOne, getStartEndDate, handleSelectOptionSort } = useConference()
    const { loading: loadingConf, listFollowed, followConference, unfollowConference } = useFollow()
    const { optionsSelected } = useSearch()
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [isClickFollow, setIsClickFollow] = useState(false)
    const [displayConferences, setDisplayedConferences] = useState([])
    const [currentPage, setCurrentPage] = useState([])
    const [loadingPage, setLoadingPage] = useState(false)

    const itemsPerPage = 7;
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
        if (updatedCheck) {
            const current = conferencesProp.slice(page * itemsPerPage, (page + 1) * itemsPerPage)
            setCurrentPage(current)

            setLoadingPage(false)
        }

    }, [loadingPage, conferencesProp, page]);

    useEffect(() => {
        if (loadingConf) {
            document.body.style.cursor = 'wait'
        } else {
            { document.body.style.cursor = 'default'; }
        }
        return () => {
            { document.body.style.cursor = 'default'; }
        };
    }, [loadingConf]);

    const handleFollow = async (event, id) => {
        event.stopPropagation();
        setIsClickFollow(true)
        const status = await followConference(id)
    }


    const handleUnfollow = async (event, id) => {
        event.stopPropagation();
        setIsClickFollow(true)
        const status = await unfollowConference(id)
    }
    const handlePageClick = async (event) => {
        setPage(event.selected)
        // Cuộn lên đầu danh sách khi chuyển trang
        const element = document.getElementById('conferences-render');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
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

    const renderLocation = (organizations) => {
        const newOrg = organizations.find(org => org.status === "new");
        return newOrg ? newOrg.location : ''
    };

    if (loading) {
        return (
            <Container className='d-flex flex-column align-items-center p-0 h-100 overflow-hidden'>
                <LoadingConferences onReload={onReload} />
            </Container>
        )
    }
    return (
        <Container id='conferences-render' className='d-flex flex-column align-items-center p-0'>

            <div className="mb-3 px-4 d-flex align-items-center justify-content-between w-100">
                <div className="h5 fw-bold ms-4 mt-2">
                    {`${totalConferences} conferences`}
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 px-5 mx-5">
                <PriorityOptions />

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
                                                <Loading />
                                            </div>
                                            :
                                            <>
                                                {

                                                    currentPage.map((conf) => (
                                                        <Card
                                                            className='my-conf-card'
                                                            id={conf.id}
                                                            key={conf.id}>
                                                            <Stack className='p-0 w-100 align-items-start' direction='horizontal'>
                                                                <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center acronym-container border border-teal-normal'>
                                                                    <span className={`fw-bold ${getLengthString(conf.information.acronym) > 6 ? 'fs-6' : 'fs-4'}`}>{conf.information.acronym}</span>
                                                                </div>

                                                                <div className='w-100'>
                                                                    <Card.Body onClick={() => chooseConf(conf.id)} className='py-0'>
                                                                        <Card.Title className=''>
                                                                            <div className='fw-bold d-flex align-items-center justify-content-start'>
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
                                                                                <span className='fw-bold fs-5 text-justify text-color-darker'>{conf.information.name}</span>
                                                                            </div>

                                                                        </Card.Title>
                                                                        <Stack direction="horizontal" gap={5}>
                                                                            {
                                                                                getSubDate(conf.importantDates) &&
                                                                                    <Card.Text className='d-flex align-items-center mb-1 text-color-black'>
                                                                                        <FontAwesomeIcon icon={faClock} className='me-2' />
                                                                                        <label className='conf-data-label'>Submission Date: </label>
                                                                                        <span className='conf-data'>
                                                                                            {getSubDate(conf.importantDates)}
                                                                                        </span>
                                                                                    </Card.Text>
                                                                            }

                                                                            {
                                                                                getStartEndDate(conf.organizations)
                                                                                    &&
                                                                                    <Card.Text className='d-flex align-items-center mb-1 text-color-black'>
                                                                                        <FontAwesomeIcon icon={faClock} className='me-2' />
                                                                                        <label className='conf-data-label'>Conference Date: </label>
                                                                                        <span className='conf-data'>

                                                                                            <>
                                                                                                {getStartEndDate(conf.organizations)}

                                                                                            </>

                                                                                        </span>
                                                                                    </Card.Text>
                                                                            }

                                                                            {
                                                                                !getSubDate(conf.importantDates) && !getStartEndDate(conf.organizations)
                                                                                &&
                                                                                <>
                                                                                 <Card.Text className='d-flex align-items-center mb-1 text-color-black'>
                                                                                        <label className='conf-data-label'>Rank: </label>
                                                                                        <span className='conf-data'>
                                                                                            <>
                                                                                                {conf.information.rank}
                                                                                            </>
                                                                                        </span>
                                                                                </Card.Text>
                                                                                <Card.Text className='d-flex align-items-center mb-1 text-color-black'>
                                                                                        <label className='conf-data-label'>Source: </label>
                                                                                        <span className='conf-data'>
                                                                                            <>
                                                                                                {conf.information.source}
                                                                                            </>
                                                                                        </span>
                                                                                </Card.Text>
                                                                                </>
                                                                            }

                                                                        </Stack>
                                                                        <div className="w-100 d-flex align-items-center justify-content-between">
                                                                            {
                                                                                renderLocation(conf.organizations) ?
                                                                                    <Card.Text className='d-flex align-items-center fs-6 mt-2 text-color-black'>
                                                                                        <FontAwesomeIcon icon={faLocationPin} className='me-2 fs-5' />
                                                                                        {renderLocation(conf.organizations)}
                                                                                    </Card.Text>
                                                                                    :
                                                                                    <Card.Text className='d-flex align-items-center fs-6 mt-2 text-color-black'>

                                                                                    </Card.Text>
                                                                            }

                                                                            <div>
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
                                                                                                    <Button className='icon-follow border border-primary-light' onClick={(event) => handleUnfollow(event, conf.id)} title='Unfollow'>
                                                                                                        <Image src={FollowIcon} width={18} />
                                                                                                        <span>Unfollow</span>
                                                                                                    </Button>
                                                                                                    :
                                                                                                    <Button className='icon-follow border border-primary-light' onClick={(event) => handleFollow(event, conf.id)}>
                                                                                                        <Image src={UnFollowIcon} width={18} />
                                                                                                        <span>Follow</span>
                                                                                                    </Button>
                                                                                            }
                                                                                        </>
                                                                                }
                                                                            </div>
                                                                        </div>

                                                                    </Card.Body>

                                                                    <div className="d-flex align-items-center justify-content-between">
                                                                        <div className='mx-2 d-flex flex-wrap w-100'>
                                                                            {
                                                                                conf.matchingKeywords &&

                                                                                <>
                                                                                    {Object.entries(conf.matchingKeywords).map(([key, keywords], index) => (
                                                                                        <div key={index} className='bg-skyblue-light px-2 py-1 rounded mx-1 my-1'>
                                                                                            {capitalizeFirstLetter(key)}: {keywords.map(k => capitalizeFirstLetter(k)).join(', ')}
                                                                                        </div>
                                                                                    ))}
                                                                                </>
                                                                            }
                                                                        </div>

                                                                    </div>

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
                                <p className='my-5'>No conferences available</p>
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