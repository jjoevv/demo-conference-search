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
    const {listFollowed, getListFollowedConferences, followConference, unfollowConference} = useFollow()
    const [loading, setLoading] = useState(false)
    const [isOrganizations, setOrganizations] = useState(false)
    const [displayOrganizations, setDisplayOrganizations] = useState([])
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
        if (conference) {
            const filterConferences = conference.organizations.filter(conference => conference.location !== null && conference.status === "new");
            
            if(filterConferences.length > 0){
                setOrganizations(true)
                setDisplayOrganizations(filterConferences)
            }
                
          }
    }, [conference, conf_id.id, listFollowed]);


    const extractYear = (source) => {
        // Sử dụng regular expression để tìm và trích xuất phần số từ chuỗi
        const yearMatch = source.match(/\d{4}/);

        // Nếu tìm thấy số năm, trả về năm đó, ngược lại trả về null
        if (yearMatch) {
            return parseInt(yearMatch[0]);
        } else {
            return '';
        }
    }

    return (
        <Container className='w-100 h-25 p-0' fluid>
            <Stack className='bg-blur p-5 mt-5 w-100 mw-100 text-center text-color-black'>
                {
                    loading ?
                        <Loading onReload={() => handleGetOne(conf_id.id)} />
                        :
                        <>
                            {
                                conference ?
                                    <>
                                        <div className='p-5'>
                                            {
                                                conference.information ?
                                                    <>
                                                        <h1 className='text-teal-normal px-5 fw-bolder'>
                                                            {conference.information.name}
                                                        </h1>

                                                        <h3 className='mb-4'>{`(${conference.information.acronym}${extractYear(conference.information.source)})`}</h3>

                                                        <h4 className='text-yellow d-inline p-1'>
                                                            {getConferenceDate(conference.organizations) !== '' && <FontAwesomeIcon icon={faCalendar} className='mx-3 fs-4'/>}                                                            
                                                            {getConferenceDate(conference.organizations)}
                                                        </h4>
                                                        <div className='d-flex justify-content-center fs-4 my-2 text-teal-normal'>
                                                                <div>
                                                                {isOrganizations  && <FontAwesomeIcon icon={faLocationPin} className='mx-3 fs-5'/>}                                                            
                                                                </div>
                                                                <div>
                                                                    {
                                                                        displayOrganizations.map((org, index) => (
                                                                            <>
                                                                                <span key={index} className='text-teal-black'>{org.location}</span>
                                                                            </>
                                                                        )
                                                                    )
                                                                    }   
                                                                </div>
                                                        </div>
                                                        <p className='fs-4  my-2'>
                                                                <Col xs={1} className=''>
                                                                    
                                                                </Col>
                                                                <Col xs={3} className='text-start'>
                                                                                                                  
                                                                </Col>
                                                        </p>

                                                        <ButtonGroup className='mt-4'>
                                                            <FollowButton listFollowed={listFollowed} onGetListFollow={getListFollowedConferences}/>
                                                            <UpdateNowButton/>
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
            <Row>
                    <Col sm={7} xs={7}>
                        <InformationPage conference={conference}/>
                       
                    </Col>
                    <Col sm={5} xs={7}>
                        <ImportantDatePage />
                    </Col>
                </Row>
                <Row className='me-5'>
                <CallforpaperPage conference={conference}/>
                </Row>
                <Row className='px-5 mx-5'>
                    <Feedbacks />
                </Row>
        </Container>
    )
}

export default DetailedInformationPage