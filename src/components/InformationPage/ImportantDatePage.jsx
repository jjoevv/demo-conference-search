import { Col, Image, Row } from 'react-bootstrap'
import moment from 'moment'
import useConference from '../../hooks/useConferences'

import { isUpcoming } from '../../utils/sortConferences'
import ArrowIcon from './../../assets/imgs/arrow.png'
import { useEffect, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/formatWord'

const ImportantDatePage = () => {
  const { conference } = useConference()
  const [displayDates, setDisplayDates] = useState([])
  useEffect(() => {
    if (conference) {
      const processedDates = conference.importantDates.reduce((acc, date) => {
        if (date.status !== "new") {
          // Bỏ qua các ngày có status khác new
          return acc;
        }
    
        const existingDate = acc.find(
          d => d.date_type === date.date_type && d.status === "new"
        );
    
        if (!existingDate) {
          const oldDate = conference.importantDates.find(
            d =>
              d.date_type === date.date_type &&
              d.status !== "new" &&
              d.date_value !== date.date_value
          );
    
          if (oldDate) {
            acc.push({ ...date, date_value_old: oldDate.date_value });
          } else {
            acc.push(date);
          }
        }
    
        return acc;
      }, [])
        .sort((a, b) => new Date(a.date_value) - new Date(b.date_value));


  setDisplayDates(processedDates)

    }


  }, [conference])
  return (
    <div className='px-5 m-5'>
      <span className='fs-4 fw-bold text-teal-dark'>Important dates</span>
      <div className='mt-2'>
        {conference ?
          <>

            {
              conference.importantDates &&
              <>
                {
                  displayDates.map((date, index) => (
                    <Row key={index} className={`${index % 2 === 0 ? 'bg-teal-light' : ''} align-items-center justify-content-center my-2`}>
                      <Col xs={3} className='text-center text-teal-normal p-1 border-teal-normal border-4 border-start'>
                        <p className='fs-4 fw-semibold text-teal-normal m-0'>{moment(date.date_value).format('MMM')}</p>
                        <p className='fs-5 fw-medium text-color-medium m-0'>{moment(date.date_value).format('DD')}</p>
                      </Col>
                      <Col className=''>
                        <span className=' fw-bold fs-5 text-color-black my-2 d-flex align-items-center'>
                          {capitalizeFirstLetter(date.date_type)}
                        </span>
                        <span className='fs-6 fw-medium text-color-medium m-0'>
                          {
                            date.date_value_old && date.date_value !== date.date_value_old ?
                              <>
                                <span className='text-danger text-decoration-line-through'>
                                {moment(date.date_value_old).format('ddd, YYYY/MM/DD')}
                                </span>
                                <Image src={ArrowIcon} width={20} className='mx-2' />
                                {moment(date.date_value).format('ddd, YYYY/MM/DD')}
                              </>
                              :
                              <>
                                {moment(date.date_value).format('dddd, YYYY/MM/DD')}

                                {isUpcoming(date.date_value) &&
                                  <span className="bg-yellow-normal d-inline p-1 px-2 rounded-3 mx-3 text-primary-emphasis fw-semibold">Upcoming</span>
                                }
                              </>

                          }
                        </span>
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