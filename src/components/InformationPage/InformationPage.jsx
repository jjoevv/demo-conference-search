import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../RedirectButton'
import { useEffect, useState } from 'react'
import moment from 'moment'
const InformationPage = ({conference}) => {
  const [isOrganizations, setOrganizations] = useState(false)
  const [displayOrganizations, setDisplayOrganizations] = useState([])
  

  const renderFieldOfResearch = (fieldOfResearch) => {
    if (Array.isArray(fieldOfResearch)) {
      // Trường là một danh sách
      return fieldOfResearch.map((item, index) => (
        <div key={index} className='my-1'>{item}</div>
      ));
    } else {
      // Trường là một giá trị đơn
      return <div>{fieldOfResearch}</div>;
    }
  };

  useEffect(() => {
    if (conference) {
      // Tạo một mảng để lưu các phần tử duy nhất
      const uniqueOrganizations = [];
      // Tạo một đối tượng để lưu trữ các phần tử theo tên
      const orgMap = new Map();

      conference.organizations.forEach(org => {
        if (orgMap.has(org.name)) {
          const existingOrg = orgMap.get(org.name);
          if (existingOrg.status !== 'new' && org.status === 'new') {
            // Nếu tồn tại phần tử có status khác 'new' và phần tử hiện tại có status 'new'
            org.start_date_old = existingOrg.start_date;
            org.start_date_new = org.start_date;
            // Thay thế phần tử cũ bằng phần tử mới
            orgMap.set(org.name, org);
          }
        } else {
          orgMap.set(org.name, org);
        }
      });

      // Lọc các phần tử không có status 'old'
      orgMap.forEach((org, name) => {
        if (org.status !== 'old') {
          uniqueOrganizations.push(org);
        }
      });

      if (uniqueOrganizations.length > 1) {
        setOrganizations(true)
      }
      setDisplayOrganizations(uniqueOrganizations)

    }
  }, [conference])


  return (
    <div className='px-5 m-5 ' >
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span className='text-teal-dark'>Conference information</span>
        <RedirectButton conference={conference} />
      </div>
      {conference ?
        <>

          <div className='fs-5 fw-bold mt-2 py-3'>{conference.information.name}</div>
          <div className='my-2'>

            {
              displayOrganizations.map((org, index) => (
                <>
                  {
                    org.status === "new" &&
                    <div key={index}>
                      {isOrganizations && <span className='fw-bold text-color-black fs-5'>Organization {index + 1}</span>}
                      <Row className='py-3 ps-5 bg-teal-light' >
                        <Col xs={4}>Organization name:</Col>
                        <Col className='fw-bold'>
                          {capitalizeFirstLetter(org.name)}
                        </Col>
                      </Row>
                      <Row className='py-3 ps-5'>
                        <Col xs={4}>Type:</Col>
                        <Col className='fw-bold'>
                          {
                            org.type !== null
                              ?
                              capitalizeFirstLetter(org.type)
                              :
                              <span className='text-secondary'>Updating...</span>
                          }
                        </Col>
                      </Row>
                      <Row className='py-3 ps-5 bg-teal-light'>
                        <Col xs={4}>Location:</Col>
                        <Col className='fw-bold'>
                          {
                            org.location !== null || org.location !== ''
                              ?
                              capitalizeFirstLetter(org.type)
                              :
                              <span className='text-secondary'>Updating...</span>
                          }
                        </Col>
                      </Row>
                      <Row className='py-3 ps-5'>

                        <Col xs={4}>Conference date:</Col>
                        <Col className='fw-bold'>

                          From {org.start_date !== '' || org.start_date !== null ? moment(org.start_date).format('ddd, YYYY/MM/DD') : <span className='text-secondary'>Updating...</span>}
                          {org.end_date && ` to ${moment(org.end_date).format('ddd, YYYY/MM/DD')}`}

                        </Col>
                      </Row>
                    </div>
                  }
                </>
              ))
            }


            <Row className='bg-teal-light py-3 ps-5'>
              <Col xs={4}>Category:</Col>
              <Col className='fw-bold'>Conference</Col>
            </Row>
            <Row className='py-3 ps-5'>
              <Col xs={4}>Acronym:</Col>
              <Col className='fw-bold'>{conference.information.acronym}</Col>
            </Row>
            <Row className='bg-teal-light py-3 ps-5'>
              <Col xs={4}>Source:</Col>
              <Col className='fw-bold'>{conference.information.source}</Col>
            </Row>
            <Row className='py-3 ps-5'>
              <Col xs={4}>Rank:</Col>
              <Col className='fw-bold'>{conference.information.rank}
              </Col>
            </Row>
            <Row className='py-3 ps-5 bg-teal-light'>
              <Col xs={4}>Rating:</Col>
              <Col className='fw-bold'>{conference.information.rating ? conference.information.rating : <span className='text-secondary'>Updating...</span>}
              </Col>
            </Row>
            <Row className='py-3 ps-5'>
              <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
              <Col className='fw-bold'>
                {renderFieldOfResearch(conference.information.fieldOfResearch)}
              </Col>
            </Row>
          </div>
        </>
        :
        <span>Currently no information available on this page.</span>}

    </div>
  )
}

export default InformationPage