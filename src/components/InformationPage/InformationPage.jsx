import { Col, Row } from 'react-bootstrap'
import useConference from '../../hooks/useConferences'
import { capitalizeFirstLetter } from '../../utils/formatWord'
import RedirectButton from '../RedirectButton'
const InformationPage = ({ conference }) => {
  const { getConferenceDate } = useConference()

  const renderFieldOfResearch = (fieldOfResearch) => {
    if (fieldOfResearch.length === 0) {
      return null
    }

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

  return (
    <div className='px-5 m-5' >
      <div className='fs-4 fw-bold fs-5 d-flex justify-content-between '>
        <span className='text-teal-dark'>Conference information</span>
        <RedirectButton conference={conference} />
      </div>
      {conference ?
        <>

          <div className='fw-bold fs-5 fs-5 fw-bold fs-5 mt-2 py-3'>{conference.information.name}</div>
          <div className='my-2'>
            {renderType(conference.organizations) &&
              <Row className='py-3 ps-4'>
                <Col xs={4} className='d-flex align-items-center'>Type:</Col>
                <Col className='fw-bold fs-5'>
                  {capitalizeFirstLetter(renderType(conference.organizations))}
                </Col>
              </Row>

            }
            {
              renderLocation(conference.organizations) &&
              <Row className='py-3 ps-4 bg-teal-light'>
                <Col xs={4} className='d-flex align-items-center'>Location:</Col>
                <Col className='fw-bold fs-5'>
                  {renderLocation(conference.organizations)}
                </Col>
              </Row>
            }
            {
              getConferenceDate(conference.organizations) &&
              <Row className='py-3 ps-4'>

                <Col xs={4} className='d-flex align-items-center'>Conference date:</Col>
                <Col className='fw-bold fs-5'>

                  {
                    getConferenceDate(conference.organizations)
                  }

                </Col>
              </Row>
            }


            <Row className='bg-teal-light py-3 ps-4'>
              <Col xs={4} className='d-flex align-items-center'>Category:</Col>
              <Col className='fw-bold fs-5'>Conference</Col>
            </Row>
            {
              conference.information.acronym &&
              <Row className='py-3 ps-4'>
                <Col xs={4} className='d-flex align-items-center'>Acronym:</Col>
                <Col className='fw-bold fs-5'>{conference.information.acronym}</Col>
              </Row>

            }
            {
              conference.information.source &&
              <Row className='bg-teal-light py-3 ps-4'>
                <Col xs={4} className='d-flex align-items-center'>Source:</Col>
                <Col className='fw-bold fs-5'>{conference.information.source}</Col>
              </Row>
            }
            {
              conference.information.rank &&
              <Row className='py-3 ps-4'>
                <Col xs={4} className='d-flex align-items-center'>Rank:</Col>
                <Col className='fw-bold fs-5'>{conference.information.rank}
                </Col>
              </Row>
            }
            {
              conference.information.rating &&
              <Row className='py-3 ps-4 bg-teal-light'>
                <Col xs={4} className='d-flex align-items-center'>Rating:</Col>
                <Col className='fw-bold fs-5'>{conference.information.rating}
                </Col>
              </Row>
            }
            {renderFieldOfResearch(conference.information.fieldOfResearch)
              &&
              <Row className='py-3 ps-4'>
                <Col xs={4} className='d-flex align-items-center'>Field of research:</Col>
                <Col className='fw-bold fs-5'>
                  {renderFieldOfResearch(conference.information.fieldOfResearch)}
                </Col>
              </Row>
            }

          </div>
        </>
        :
        <span>Currently no information available on this page.</span>}

    </div>
  )
}

export default InformationPage