import { Col, Image, Row } from 'react-bootstrap'
import moment from 'moment'
import useConference from '../../hooks/useConferences'

import { isUpcoming } from '../../utils/sortConferences'
import ArrowIcon from './../../assets/imgs/arrow.png'
import { useEffect, useState } from 'react'

const ImportantDatePage = () => {
  const { conference } = useConference()
  const [displayDates, setDisplayDates] = useState([])
  

  useEffect(()=>{
if(conference){


const updatedDates = conference.importantDates.map(date => {
  // Nếu status là 'new'
  if (date.status === 'new') {
    // Tìm ngày cũ tương ứng với cùng loại ngày và status là 'old'
    const oldDate = conference.importantDates.find(d => d.status === 'old' && d.date_type === date.date_type);
    if (oldDate) {
      // Nếu tìm thấy ngày cũ, thêm date_value_old vào mục mới
      date.date_value_old = oldDate.date_value;
    }
  }
  return date;
}).filter(date => date.status !== 'old'); // Loại bỏ các mục có status là 'old'

setDisplayDates(updatedDates)
}
  },[conference])
  return (
    <div className='px-5 m-5'>
      <span className='fs-4 fw-bold text-teal-dark'>Imoprtant dates</span>
      <div className='mt-2'>
        {conference ?
          <>
            
            {
              conference.importantDates && 
              <>
              {
                displayDates.map((date, index)=>(
                  <Row key={index} className={`${index % 2 === 0 ? 'bg-teal-light' : ''} align-items-center justify-content-center my-2`}>
                    <Col xs={3} className='text-center text-teal-normal p-1 border-teal-normal border-4 border-start'>
                      <p className='fs-4 fw-semibold text-teal-normal m-0'>{moment(date.date_value).format('ddd')}</p>
                      <p className='fs-5 fw-medium text-color-medium m-0'>{moment(date.date_value).format('DD')}</p>
                    </Col>
                    <Col className=''>
                        <p className=' fw-bold fs-5 text-color-black my-2 d-flex align-items-center'>{date.date_type}</p>
                        <p className='fs-6 fw-medium text-color-medium m-0'>
                      {
                          date.date_value_old ?
                            <>
                              <span className='text-danger text-decoration-line-through'>{date.date_value_old}</span>
                              <Image src={ArrowIcon} width={20} className='mx-2' />
                              {moment(date.date_value).format('dddd, MM/DD/YYY')}
                            </>
                            :
                            <>
                            {moment(date.date_value).format('dddd, MM/DD/YYYY')}
                            
                        {isUpcoming(date.date_value) &&
                          <p className="bg-yellow-normal d-inline p-1 px-2 rounded-3 mx-3 text-primary-emphasis fw-semibold">Upcoming</p>
                        }
                            </>
                            
                        }
                      </p>
                    </Col>
                  </Row>
                ))
              }
              </>
            }
          </>
          :
          <span>Currently no information available on this page.</span>}
      </div>
    </div>
  )
}

export default ImportantDatePage