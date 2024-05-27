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
      const updatedDates = conference.importantDates
      .map(date => {
        if (date.status === 'new') {
          // Tìm phần tử có cùng date_type và date_value nhưng khác status
          const duplicate = conference.importantDates.find(d => d.status !== 'new' && d.date_type === date.date_type && d.date_value === date.date_value);
          if (duplicate) {
            // Nếu tìm thấy phần tử trùng lặp, không thêm date_value_old và xóa phần tử đó
            const duplicateIndex = conference.importantDates.indexOf(duplicate);
            if (duplicateIndex !== -1) {
              conference.importantDates.splice(duplicateIndex, 1);
            }
          } else {
            // Tìm ngày cũ tương ứng với cùng loại ngày và status là 'old'
            const oldDate = conference.importantDates.find(d => d.status === 'old' && d.date_type === date.date_type);
            if (oldDate) {
              // Nếu tìm thấy ngày cũ, thêm date_value_old vào mục mới
              date.date_value_old = oldDate.date_value;
            }
          }
        }
        return date;
      })
      .filter(date => date.status !== 'old'); // Loại bỏ các mục có status là 'old'
    
    // Mảng để lưu kết quả cuối cùng
    const uniqueDates = [];
    // Set để kiểm tra các phần tử trùng lặp
    const seen = new Set();
    
    updatedDates.forEach(date => {
      const identifier = `${date.date_type}-${date.value}-${date.status}`;
      if (date.status === 'new' && seen.has(identifier)) {
        // Bỏ qua phần tử trùng lặp
        return;
      }
      uniqueDates.push(date);
      seen.add(identifier);
    });
    setDisplayDates(uniqueDates)

    }


  }, [conference])
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