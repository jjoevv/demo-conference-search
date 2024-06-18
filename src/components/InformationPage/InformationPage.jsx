import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../RedirectButton'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
const InformationPage = ({ conference }) => {
  const { getConferenceDate, checkUrl } = useConference()
    const [isValidUrl, setIsValidUrl] = useState(null);
    useEffect(() => {
        if (conference?.information?.link) {
          checkUrl(conference?.information?.link).then(isValid => {
            setIsValidUrl(isValid);
          });
        }
      }, [conference]);
  const renderFieldOfResearch = (fieldOfResearch) => {
    if (fieldOfResearch.length === 0) {
      return null    }

    if (Array.isArray(fieldOfResearch)) {
      // Trường là một danh sách
      const uniqueValues = Array.from(new Set(fieldOfResearch));
      return uniqueValues.map((item, index) => (
        <div key={index} className='my-1'>{item}</div>
      ));
    } else {
      // Trường là một giá trị đơn
      return <div>{fieldOfResearch}</div>;
    }
  };
  const renderLocation = (organizations) => {
    const newOrg = organizations.find(org => org.status === "new");
    return newOrg ? newOrg.location : ''
  };

  const renderType = (organizations) => {
    const newOrg = organizations.find(org => org.status === "new");
    return newOrg ? newOrg.type : null
  };
  const rows = [
    conference.information.acronym && (
      <Row key="acronym" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Acronym:</Col>
        <Col className='fw-bold fs-large'>{conference.information.acronym}</Col>
      </Row>
    ),
    <Row key="category" className='py-3 ps-4'>
      <Col xs={4} className='d-flex align-items-center'>Category:</Col>
      <Col className='fw-bold fs-large'>Conference</Col>
    </Row>,
    conference.information.source && (
      <Row key="source" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Source:</Col>
        <Col className='fw-bold fs-large'>{conference.information.source}</Col>
      </Row>
    ),
    renderType(conference.organizations) && (
      <Row key="type" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Type:</Col>
        <Col className='fw-bold fs-large'>
          {capitalizeFirstLetter(renderType(conference.organizations))}
        </Col>
      </Row>
    ),
    renderLocation(conference.organizations) && (
      <Row key="location" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Location:</Col>
        <Col className='fw-bold fs-large'>
          {renderLocation(conference.organizations)}
        </Col>
      </Row>
    ),
    getConferenceDate(conference.organizations) && (
      <Row key="conference-date" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Conference date:</Col>
        <Col className='fw-bold fs-large'>
          {getConferenceDate(conference.organizations)}
        </Col>
      </Row>
    ),
    conference.information.rank && (
      <Row key="rank" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Rank:</Col>
        <Col className='fw-bold fs-large'>{conference.information.rank}</Col>
      </Row>
    ),
    conference.information.rating && (
      <Row key="rating" className='py-3 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Rating:</Col>
        <Col className='fw-bold fs-large'>
          {parseFloat(conference.information.rating.toFixed(2))}
        </Col>
      </Row>
    ),
    renderFieldOfResearch(conference.information.fieldOfResearch) && (
      <Row key="field-of-research" className={`py-3 ps-4 pe-1`}>
        <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
        <Col className='fw-bold fs-large'>
          {renderFieldOfResearch(conference.information.fieldOfResearch)}
        </Col>
      </Row>
    ),
  ];
    // Loại bỏ các hàng không hợp lệ (null, undefined)
    const validRows = rows.filter(row => row);
  return (
    <div className='p-5 m-0' >
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span className='fs-3 fw-bold text-teal-normal'>
        <FontAwesomeIcon icon={faCircleInfo} className='me-1'/> Conference information
        </span>
        {
          isValidUrl && <RedirectButton conference={conference} />
        }
      </div>
      {conference && conference !== null ?
        <>

          <div className='fw-bold fs-large fs-large fw-bold fs-large mt-2 py-3'>{conference.information.name}</div>
          <div className='my-2'>
          {validRows.map((row, index) => (
        <div key={index} className={index % 2 === 0 ? 'bg-beige-light' : ''}>
          {row}
        </div>
      ))}

          </div>
        </>
        :
        <span>Currently no information available on this page.</span>}

    </div>
  )
}

export default InformationPage