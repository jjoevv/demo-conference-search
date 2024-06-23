
import { Col, Container, Form, Row } from 'react-bootstrap';
import useNote from '../../hooks/useNote';
import useFollow from '../../hooks/useFollow';
import EventCalendar from '../../components/Calendar/EventCalendar';
import UpcomingNote from '../../components/Calendar/UpcomingNote';
import Loading from '../../components/Loading';
import { useTranslation } from 'react-i18next';

const Timestamp = () => {
  const {t} = useTranslation()
  const { loading, notes, getAllNotes} = useNote()  
  
  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>
        <h4 className='mb-3'>{t('note')}</h4>

        <h6 className=''>{t('note_page_description')}</h6>  
      <Row className='w-75'>
        {
          loading
          ?
          <div className=""></div>
          :          
          <UpcomingNote/>
        }
      </Row>
      <Row className='mt-5'>
        <Col xs="9" >          
        {
          loading
          ?
          <Loading onReload={getAllNotes}/>
          :
          <>
          <EventCalendar notes={notes}/>
          </>
        }
        </Col>
        <Col xs="3" className='ps-3'>          
          <div className='ms-1 mt-3'>
            <h5>{t('calendar_notes')}</h5>
            <Row className='align-items-center'>
              <div className="bg-red-normal me-2 my-2 fs-6 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Submission date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-blue-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Notification date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-teal-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Camera ready date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-yellow-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Conference date
            </Row>
            <Row className='align-items-center'>
              <div className="bg-skyblue-normal me-2 my-2 rounded-1" style={{width: "20px", height: "20px"}}></div>
              Your note
            </Row>
          </div> 

        </Col>
      </Row>
    </Container>
  )
}

export default Timestamp