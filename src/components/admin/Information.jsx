import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../RedirectButton'
import ImportantDatePage from '../Informationpage/ImportantDatePage'

const Information = ({ conference }) => {
  const { getConferenceDate } = useConference()
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

     <>
      <Row key="acronym" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Acronym:</Col>
        <Col className='fw-bold fs-large'>{conference.information.acronym}</Col>
      </Row>

    <Row key="category" className='py-2 ps-4'>
      <Col xs={4} className='d-flex align-items-center'>Category:</Col>
      <Col className='fw-bold fs-large'>Conference</Col>
    </Row>
 
      <Row key="source" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Source:</Col>
        <Col className='fw-bold fs-large'>{conference.information.source}</Col>
      </Row>
      <Row key="link" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Link:</Col>
        <Col className='fw-bold fs-large'>{conference.information.link}</Col>
      </Row>

      <Row key="type" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Type:</Col>
        <Col className='fw-bold fs-large'>
          {capitalizeFirstLetter(renderType(conference.organizations))}
        </Col>
      </Row>

      <Row key="location" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Location:</Col>
        <Col className='fw-bold fs-large'>
          {renderLocation(conference.organizations)}
        </Col>
      </Row>
      <Row key="conference-date" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Conference date:</Col>
        <Col className='fw-bold fs-large'>
          {getConferenceDate(conference.organizations)}
        </Col>
      </Row>
      <Row key="rating" className='py-2 ps-4'>
        <Col xs={4} className='d-flex align-items-center'>Rating:</Col>
        <Col className='fw-bold fs-large'>
          {conference.rating && parseFloat(conference.information.rating.toFixed(2))}
        </Col>
      </Row>
      <Row key="field-of-research" className={`py-2 ps-4 pe-1`}>
        <Col xs={4} className='d-flex align-items-start'>Field of research:</Col>
        <Col className='fw-bold fs-large'>
          {renderFieldOfResearch(conference.information.fieldOfResearch)}
        </Col>
      </Row>
     </>
  ];
  return (
    <div className='p-5 m-0' >
      <div className='fs-4 fw-bold d-flex justify-content-between '>
        <span className='text-teal-normal'>Conference information</span>
        <RedirectButton conference={conference} />
      </div>
      {conference && conference !== null ?
        <>
        
            <Row>
                <Col>
                <div className='fw-bold fs-large fs-large fw-bold fs-large mt-2 py-2'>{conference.information.name}</div>
          <div className='my-2'>
          {rows.map((row, index) => (
        <div key={index} className={index % 2 === 0 ? 'bg-beige-light' : ''}>
          {row}
        </div>
      ))}

          </div>
                </Col>
                <Col>
                <ImportantDatePage conference={conference}/>
                </Col>
            </Row>
      
        </>
        :
        <span>Currently no information available on this page.</span>}

    </div>
  )
}


export default Information