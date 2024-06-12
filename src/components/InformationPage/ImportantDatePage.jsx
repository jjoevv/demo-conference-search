import { Image, Row } from 'react-bootstrap'
import moment from 'moment'

import { isUpcoming } from '../../utils/sortConferences'
import ArrowIcon from './../../assets/imgs/arrow.png'
import { useEffect, useState } from 'react'
import { capitalizeFirstLetter } from '../../utils/formatWord'

const ImportantDatePage = ({conference}) => {
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
  const today = new Date();
  const checkDate = (dateValue) => {
    const date = new Date(dateValue);
    return date < today;
};

  return (
    <div className='m-5'>
      <span className='fs-4 fw-bold text-teal-normal'>Important dates</span>
      <div className='mt-2' style={{maxHeight: "600px", overflowY: "auto"}} >

        {conference ?
          <>

            {
              conference.importantDates && conference.importantDates.length > 0 ?
              <>
                {
                  displayDates.map((date, index) => (
                    <Row key={index} 
                    className={`${index % 2 === 0 ? 'bg-beige-light' : ''} 
                    align-items-center justify-content-center m-2 px-1 py-2 position-relative  border-teal-normal border-5 border-start overflow-hidden`}>
                     
                        <span className=' fw-bold text-color-black d-flex align-items-center fs-large' >
                          {capitalizeFirstLetter(date.date_type)}
                        </span>
                        <span className='fs-large fw-medium text-color-black m-0'>
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
                                {checkDate(date.date_value) && <span className='text-secondary'> (Time expired)</span>}

                              </>

                          }
                        </span>
                        
                      {isUpcoming(date.date_value) &&
                                  <span className="ribbon">Upcoming</span>
                                }
                    </Row>
                  ))
                }
              </>
              :
              <>
              <p className="my-2">No organization dates available</p>
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