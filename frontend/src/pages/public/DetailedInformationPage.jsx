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
    const { conference, handleGetOne, getConferenceDate, getLocation } = useConference()
    const {listFollowed, getListFollowedConferences, followConference, unfollowConference} = useFollow()
    const [loading, setLoading] = useState(false)
    const conf_id = useParams()
    useEffect(() => {

        const fetchData = async () => {
            await handleGetOne(conf_id.id);
            await getListFollowedConferences()
            setLoading(false)
        }
        if (!conference && conf_id.id) {
            setLoading(true)
            fetchData()
        }
    }, [conference, conf_id.id, handleGetOne, listFollowed]);


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
            <Stack className='bg-blur p-5 mt-5 w-100 mw-100 text-center text-color-black bgtext'>
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
                                                            {getConferenceDate(conference.organizations) !== '' && <FontAwesomeIcon icon={faCalendar} className='mx-3 fs-5'/>}                                                            
                                                            {getConferenceDate(conference.organizations)}
                                                        </h4>
                                                        <p className='fs-5 my-2'>
                                                            {getLocation(conference.organizations)!==''&&<FontAwesomeIcon icon={faLocationPin} className='mx-3 fs-5'/>}                                                            
                                                            {getLocation(conference.organizations)}
                                                        </p>

                                                        <ButtonGroup className='mt-4'>
                                                            <FollowButton/>
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
                        <InformationPage />
                        <CallforpaperPage />
                    </Col>
                    <Col sm={5}>
                        <ImportantDatePage />
                    </Col>
                </Row>
                
                <Row className='px-5 mx-5'>
                    <Feedbacks />
                </Row>
        </Container>
    )
}

export default DetailedInformationPage