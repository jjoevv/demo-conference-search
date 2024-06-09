import { useEffect, useRef, useState } from 'react'
import { Container, Card, Button, Stack, Row, Col, Image, Spinner } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import useFollow from '../../hooks/useFollow'
import { isObjectInList } from '../../utils/checkExistInList'

import useSearch from '../../hooks/useSearch'
import { DropdownSort } from '../DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../../utils/sortConferences'

import { getSubDate } from '../../utils/formatDate'
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
import useAuth from '../../hooks/useAuth'
import ExpiredModal from '../Modals/ExpiredModal'
import useParamsFilter from '../../hooks/useParamsFilter'
import ScrollToTopButton from '../ScrollToTopButton'

const Conference = ({ conferencesProp, loading, totalPages, onReload, totalConferences, isPost }) => {
    const { selectOptionSort, getStartEndDate, handleSelectOptionSort } = useConference()
    const { listFollowed, followConference, unfollowConference } = useFollow()
    const { optionsSelected } = useSearch()
    const { pageParam, setPage } = useParamsFilter()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [showPopupFollow, setShowPopupFollow] = useState(false)
    const [followedIds, setFollowedIds] = useState(new Set());
    const [pageDisplay, setPageDisplay] = useState(pageParam)
    const [displayConferences, setDisplayedConferences] = useState(conferencesProp)
    const [loadingMap, setLoadingMap] = useState({});
    const scrollPositions = useRef({});
    const itemsPerPage = 7;
    let pageCount = Math.ceil(conferencesProp.length / 7)


    useEffect(() => {
        setPageDisplay(pageParam)
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [pageParam])

    useEffect(() => {
        const idsSet = new Set(listFollowed.map(item => item.id));
        setFollowedIds(idsSet);
    }, [listFollowed]);

    useEffect(() => {
        setDisplayedConferences(conferencesProp)

    }, [conferencesProp, listFollowed])


    useEffect(() => {
        if (selectOptionSort === "Random") {
            setDisplayedConferences(conferencesProp)
        }
        else if (selectOptionSort === "Followed") {

            if (user) {
                const sortedByFollow = sortByFollow(conferencesProp, listFollowed)
                setDisplayedConferences(sortedByFollow)
            }
            else {
                setShowPopupFollow(true)
            }
        }
        else {
            const sortedConferences = sortConferences(selectOptionSort, [...conferencesProp])
            setDisplayedConferences(sortedConferences)
        }
    }, [selectOptionSort])




    const isFollowed = (itemId) => {
        return followedIds.has(itemId);
    };

    const handleFollow = async (event, id) => {
        event.stopPropagation();
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: true, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));

        if (event.defaultPrevented) return  // Exits here if event has been handled
        event.preventDefault()
        const status = await followConference(id)
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: false, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));
    }


    const handleUnfollow = async (event, id) => {
        event.stopPropagation();
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: true, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));

        if (event.defaultPrevented) return  // Exits here if event has been handled
        event.preventDefault()
        const status = await unfollowConference(id)
        setLoadingMap((prevLoadingMap) => ({
            ...prevLoadingMap,
            [id]: false, // Đặt trạng thái loading của nút vừa nhấn thành true
        }));
    }


    const handlePageClick = async (pagenumber) => {
        setPage(pagenumber)
        // Cuộn lên đầu danh sách khi chuyển trang
        const element = document.getElementById('conferences-render');
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const chooseConf = async (e, id) => {
        e.preventDefault()
        // Lưu vị trí cuộn hiện tại trước khi cập nhật URL
        scrollPositions.current[window.location.pathname + window.location.search] = window.scrollY;
        // Cập nhật URL với trang mới
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('page', pageDisplay + 1); // Thêm 1 để page bắt đầu từ 1 thay vì 0
        window.history.pushState({}, '', newUrl);

        // Cuộn lên đầu danh sách khi chuyển trang
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        const searchParam = newUrl.href + `/detailed-information/${id}`

         // Navigate to new URL
        window.history.pushState({}, '', searchParam);
        //window.location.href = newUrl
        navigate(`/detailed-information/${id}`)

    }


    const handleDropdownSelect = (value) => {
        setPage(0)
        handleSelectOptionSort(value)
    };

    const getLengthString = (string) => string.length

    const renderLocation = (organizations) => {
        const newOrg = organizations.find(org => org.status === "new");
        return newOrg ? newOrg.location : ''
    };
    //   console.log({loading, conferencesProp, displayConferences})

    if (loading) {
        return (
            <Container fluid className='d-flex flex-column align-items-center vh-100 p-0 overflow-hidden'>
                <LoadingConferences onReload={onReload} />
            </Container>
        )
    }
    return (
        <Container id='conferences-render' className='d-flex flex-column align-items-center p-0'>
              <ScrollToTopButton />
            <div className="mb-3 px-4 d-flex align-items-center justify-content-between w-100">
                <div className="h5 fw-bold ms-4 mt-2">
                    {`${conferencesProp.length} conferences`}
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 px-5 mx-5">
                <PriorityOptions />

                <DropdownSort
                    options={["Random", "Followed", "Upcoming", "Name A > Z", "Latest"]}
                    onSelect={handleDropdownSelect}
                />
            </div>
            <ExpiredModal onClose={() => setShowPopupFollow(false)} isOpen={showPopupFollow} />
            {
                conferencesProp && !loading
                    ?
                    <div style={{ minHeight: "700px" }}>
                        {
                            displayConferences
                                .slice(pageDisplay * itemsPerPage, (pageDisplay + 1) * itemsPerPage)
                                .map((conf) => (
                                    <Card
                                        className='my-conf-card'
                                        id={conf.id}
                                        key={conf.id}>
                                        <Stack className='p-0 w-100 align-items-start' direction='horizontal'>
                                            <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center text-center acronym-container border border-teal-normal'>
                                                <span className={`fw-bold ${getLengthString(conf.information.acronym) > 6 ? 'fs-6' : 'fs-4'}`}>{conf.information.acronym}</span>
                                            </div>

                                            <div className='w-100'>
                                                <Card.Body onClick={(e) => chooseConf(e, conf.id)} className='py-0'>
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
                                                                            isFollowed(conf.id)
                                                                                ?
                                                                                <Button
                                                                                    className='icon-follow border border-primary-light'
                                                                                    onClick={(event) => handleUnfollow(event, conf.id)}
                                                                                    title='Unfollow'
                                                                                    disabled={loadingMap[conf.id]}>
                                                                                    {
                                                                                        loadingMap[conf.id] ? <Spinner size={'sm'} /> :
                                                                                            <>
                                                                                                <Image src={FollowIcon} width={18} />
                                                                                                <span>Unfollow</span>
                                                                                            </>
                                                                                    }
                                                                                </Button>
                                                                                :
                                                                                <Button
                                                                                    title='Follow conference'
                                                                                    className='icon-follow border border-primary-light'
                                                                                    onClick={(event) => handleFollow(event, conf.id)}
                                                                                    disabled={loadingMap[conf.id]}
                                                                                >
                                                                                    {
                                                                                        loadingMap[conf.id] ? <Spinner size={'sm'} /> :
                                                                                            <>
                                                                                                <Image src={UnFollowIcon} width={18} />
                                                                                                <span>Follow</span>
                                                                                            </>
                                                                                    }

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

                    </div>
                    :
                    <>
                        <p className='my-5'>No conferences available</p>
                    </>
            }


            <Row>
                <Col>

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        previousLabel="<"
                        onPageChange={(e) => handlePageClick(e.selected)}
                        forcePage={pageDisplay}
                        pageRangeDisplayed={4}
                        marginPagesDisplayed={1}
                        pageCount={pageCount}
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