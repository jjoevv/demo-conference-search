import { useEffect, useState } from 'react'
import { Container, Card, Button, Image, Stack, Row, Col } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

import UnfollowIcon from './../assets/imgs/unfollow.png'
import FollowIcon from './../assets/imgs/follow.png'
import TimeIcon from './../assets/imgs/time.png'
import LocationIcon from './../assets/imgs/location.png'
import useFollow from '../hooks/useFollow'
import { isObjectInList } from '../utils/checkExistInList'

import useSearch from '../hooks/useSearch'
import { DropdownSort } from './DropdownSort'
import { isUpcoming, sortByFollow, sortConferences } from '../utils/sortConferences'

import ArrowIcon from './../assets/imgs/arrow.png'
import Loading from './Loading'
import { getDateValue } from '../utils/formatDate'
import Filter from './Filter/Filter'
import { checkExistValue } from '../utils/checkFetchedResults'
import ButtonGroupUpdate from './PostConference/ButtonGroupUpdate'
import { useNavigate } from 'react-router-dom'

const Conference = ({ conferencesProp, loading, totalPages, onReload, totalConferences, isPost }) => {
    
    const { listFollowed, followConference, unfollowConference } = useFollow()
    const {optionsSelected} = useSearch()
    const navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [selectOptionSort, setSelectOptionSort] = useState('')
    const [copiedConferences, setcopiedConferences] = useState([])
    const [displayConferences, setDisplayedConferences] = useState([])
    
    const itemsPerPage = 7;
    const pagesVisited = page * itemsPerPage;
    
    useEffect(()=>{
        setPage(0)
    }, [optionsSelected])

    useEffect(()=>{
        const sortedConf = sortByFollow(conferencesProp, listFollowed)
        setDisplayedConferences(sortedConf)
        setcopiedConferences(sortedConf)


    },[conferencesProp, listFollowed])

   
    const handlePageClick = (event) => {
        setPage(event.selected)
        // Cuộn lên đầu danh sách khi chuyển trang
        const element = document.getElementById('conferences-render');
        if (element) {
          window.scrollTo({
            top: element.offsetTop,
            behavior: 'smooth'
          });
        }
    };

    const chooseConf = (id) => {
        navigate(`/detailed-information/${id}`)
    }


    const handleDropdownSelect = (value) => {
        setSelectOptionSort(value);
        if (value === "Random") {
            setDisplayedConferences([...copiedConferences])
        }
        else {
            const sortedConferences = sortConferences(value, [...copiedConferences])
            setDisplayedConferences(sortedConferences)
        }
        setPage(0)
    };

    const getLengthString = (string) => string.length


    if(loading){
        return (
            <Container className='d-flex flex-column align-items-center p-0'>
                <Loading onReload={onReload}/>
            </Container>
        )
    }
    return (
        <Container className='d-flex flex-column align-items-center p-0'>

            <div className="mb-3 px-4 d-flex align-items-center justify-content-between w-100">
                <div className="h5 fw-bold" id='conferences-render'>
                    Conferences
                    <span className='fw-normal'> ({totalConferences}) </span>
                </div>
              <div className='d-flex'>
              {
                checkExistValue(optionsSelected).some(value => value === true)
                &&
                <Filter/>
            }
            
            <DropdownSort
                    options={["Random", "Upcoming", "Name A > Z", "Latest"]}
                    onSelect={handleDropdownSelect}
                />
              </div>
            </div>

          <Row>
           
            <Col>
            {
                conferencesProp && conferencesProp.length > 0
                    ?
                    <>
                    {
                    displayConferences
                        .slice(pagesVisited, pagesVisited + itemsPerPage)
                        .map((conf) => (
                            <Card
                                className='my-conf-card'
                                style={{ }}
                                id={conf.id}
                                key={conf.id}>
                                <Stack className='p-0 w-100' direction='horizontal'>
                                    <div className='bg-white rounded-4 fw-bolder d-flex align-items-center justify-content-center acronym-container '>
                                        <span className={`fw-bold ${getLengthString(conf.information.acronym) > 6 ? 'fs-6' : 'fs-4'}`}>{conf.information.acronym}</span>
                                    </div>

                                    <div className='w-100'>
                                        <Card.Body className='' onClick={() => chooseConf(conf.id)}>
                                            <Card.Title className='text-color-black'>
                                                <div className='fw-bold d-flex align-items-start'>
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
                                                    <span className='conf-data'>{getDateValue("submission", conf.importantDates)}</span>
                                                </Card.Text>

                                                <Card.Text className='d-flex align-items-center mb-1'>
                                                    <Image src={TimeIcon} className='me-2' width={18} />
                                                    <label className='conf-data-label'>Conference Date: </label>
                                                    <span className='conf-data'>
                                                        {conf.organizations.length > 0 ? conf.organizations[0].start_date : 'N/A'}
                                                        <>
                                                            {
                                                                conf.organizations.length > 0 ?
                                                                    <>
                                                                        {
                                                                            conf.organizations[0].end_date && <Image src={ArrowIcon} width={20} className='mx-2' />
                                                                        }
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {`N/A`}
                                                                    </>
                                                            }
                                                        </>
                                                        {conf.organizations.length > 0 ? conf.organizations[0].end_date : 'N/A'}
                                                    </span>
                                                </Card.Text>
                                            </Stack>
                                            <Card.Text className='d-flex align-items-center'>
                                                <Image src={LocationIcon} className='me-2' width={18} height={20} />
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
                                            <ButtonGroupUpdate conference={conf}/>
                                        </div>
                                        </>
                                        :
                                        <>
                                          {
                                            isObjectInList(conf.id, listFollowed)
                                                ?
                                                <Button className='icon-follow' onClick={() => unfollowConference(conf.id)} title='Unfollow'>
                                                    <Image src={FollowIcon} className='me-2' width={18} />
                                                    <span>Unfollow</span>
                                                </Button>
                                                :
                                                <Button className='icon-follow' onClick={() => followConference(conf.id)}>
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
                    :
                    <>
                       <p>No conferences available</p>
                    </>
            }
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={4}
                marginPagesDisplayed={1}
                pageCount={totalPages}
                previousLabel="<"
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