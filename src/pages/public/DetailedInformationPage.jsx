import { useEffect, useState } from 'react'
import useConference from '../../hooks/useConferences'
import { ButtonGroup, Col, Container, Row, Stack } from 'react-bootstrap'

import Loading from '../../components/Loading'
import InformationPage from '../../components/InformationPage/InformationPage'
import ImportantDatePage from '../../components/InformationPage/ImportantDatePage'
import CallforpaperPage from '../../components/InformationPage/CallforpaperPage'
import Feedbacks from '../../components/Feedbacks/Feedbacks'
import FollowButton from '../../components/InformationPage/FollowButton'
import UpdateNowButton from '../../components/InformationPage/UpdateNowButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faLocationPin } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom'
import useFollow from '../../hooks/useFollow'
const DetailedInformationPage = () => {
    const { conference, handleGetOne, getConferenceDate } = useConference()
    const { listFollowed, getListFollowedConferences } = useFollow()
    const [loading, setLoading] = useState(false)
    const conf_id = useParams()
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const fetchData = async () => {
            await handleGetOne(conf_id.id);
            await getListFollowedConferences()
            setLoading(false)
        }
        if (!conference && conf_id.id) {
            setLoading(true)
            fetchData()
        }
    }, [conference, conf_id.id, listFollowed]);


    const renderLocation = (organizations) => {
        const newOrg = organizations.find(org => org.status === "new");
        return newOrg ? newOrg.location : ''
    };

    return (
        <Container className='w-100 h-25 p-0 overflow-x-hidden' fluid>
            <Stack className='bg-blur p-5 w-100 mw-100 text-center text-color-black'>
                {
                    loading ?
                        <div style={{height: "400px"}}>
                            <Loading onReload={() => handleGetOne(conf_id.id)} />
                        </div>
                        :
                        <>
                            {
                                conference ?
                                    <>
                                        <div className='p-5'>
                                            {
                                                conference.information ?
                                                    <>
                                                        <p className='text-teal-normal px-5 fs-larger fw-bold mt-5'>
                                                            {conference.information.name}
                                                        </p>

                                                        <h3 className='mb-4'>{`(${conference.information.acronym})`}</h3>
                                                        {
                                                            getConferenceDate(conference.organizations) !== '' &&
                                                            <h3 className='text-yellow d-inline p-1'>

                                                                <FontAwesomeIcon icon={faCalendar} className='mx-3 fs-4' />
                                                                {getConferenceDate(conference.organizations)}
                                                            </h3>
                                                        }
                                                        {renderLocation(conference.organizations) !== '' && (
                                                            <>
                                                                <div className='d-flex justify-content-center align-items-center fs-4 my-2 mt-4 text-teal-dark fw-bold'>
                                                                    <FontAwesomeIcon icon={faLocationPin} className='mx-3 fs-5' />
                                                                    <h3 className='text-teal-black'> {renderLocation(conference.organizations)}</h3>

                                                                </div>


                                                            </>
                                                        )
                                                        }

                                                        <p className='fs-4  my-2'>
                                                            <Col xs={1} className=''>

                                                            </Col>
                                                            <Col xs={3} className='text-start'>

                                                            </Col>
                                                        </p>

                                                        <ButtonGroup className='mt-5'>
                                                            <FollowButton listFollowed={listFollowed} onGetListFollow={getListFollowedConferences} />
                                                            <UpdateNowButton />
                                                        </ButtonGroup>
                                                    </>
                                                    : `Not found`
                                            }

                                        </div>

                                    </>
                                    :
                                    <>
                                        <h1>404</h1>
                                        <h3>Something went wrong! Try again</h3>
                                    </>

                            }

                        </>
                }
            </Stack>
            <div className='w-100 bg-skyblue-light -normal  p-5'>
                < Row className='bg-white m-4  '>
                    <Col sm={6} xs={6} className='p-0'>
                        <InformationPage conference={conference} />
                    </Col>
                    <Col sm={6} xs={6} className="p-0" >
                        <ImportantDatePage />
                    </Col>
                </Row>
            </div>
            <div className='w-100 bg-skyblue-normal'>
                <Row className='p-0'>
                    <CallforpaperPage conference={conference} />
                </Row>
            </div>
            <Row className='px-5 mx-5'>
                <Feedbacks />
            </Row>
        </Container>
    )
}

export default DetailedInformationPage