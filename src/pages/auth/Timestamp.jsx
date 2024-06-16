
import { Col, Container, Form, Row } from 'react-bootstrap';
import { useEffect} from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import useNote from '../../hooks/useNote';
import useFollow from '../../hooks/useFollow';
import EventCalendar from '../../components/Calendar/EventCalendar';
import UpcomingNote from '../../components/Calendar/UpcomingNote';
import Loading from '../../components/Loading';

const Timestamp = () => {
  const { loading, notes, getAllNotes} = useNote()  
  
  return (
    <Container className=' m-5 pt-5  overflow-x-hidden'>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='mb-3'>Schedule</h4>
      {
        /**
         * 
         *  <Form.Check // prettier-ignore
          reverse
          type="switch"
          id="custom-switch"
          label="Automatically add conference events to the schedule"
          value={true}
          checked={true}
        />
         */
      } 
      </div>
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
          <EventCalendar notes={notes}/>
        }
        </Col>
        <Col xs="3" className='ps-3'>          
          <div className='ms-1 mt-3'>
            <h5>Conference note details</h5>
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