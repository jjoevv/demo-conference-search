import { Col, Image, Row } from 'react-bootstrap'
import moment from 'moment'
import useConference from '../../hooks/useConferences'

import { isUpcoming } from '../../utils/sortConferences'
import ArrowIcon from './../../assets/imgs/arrow.png'

const ImportantDatePage = () => {
  const { conference } = useConference()


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
                conference.importantDates.map((date, index)=>(
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