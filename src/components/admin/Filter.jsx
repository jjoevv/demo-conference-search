
import {  Row, Col } from 'react-bootstrap';
import DropdownOptions from './DropdownOptions';
import DateRangePicker from '../Filter/DateRangePicker';


function Filter() {
  return (
    <div className='shadow p-3 border rounded mb-2'>
    <Row>
      <Col><span className="fw-bold text-color-black">Location</span><DropdownOptions label="location" placeholder="Location" /></Col>
      <Col><span className="fw-bold text-color-black">Field of research</span><DropdownOptions label="for" placeholder="Field of research"/></Col>
      <Col><span className="fw-bold text-color-black">Rank</span><DropdownOptions label="rank" placeholder="Rank" /></Col>
      <Col><span className="fw-bold text-color-black">Submission date:</span><DateRangePicker label="submissionDate"/></Col>
      <Col><span className="fw-bold text-color-black">Conference date:</span><DateRangePicker label="conferenceDate"/></Col>
    </Row>
    {/* Hàng 2 */}
    <Row className='my-2'> 
      <Col><span className="fw-bold text-color-black">Source:</span><DropdownOptions label="source" placeholder="Source" /></Col>
      <Col><span className="fw-bold text-color-black">Acronym:</span><DropdownOptions label="acronym" placeholder="Acronym" /></Col>
      <Col><span className="fw-bold text-color-black">Type:</span><DropdownOptions label="type" placeholder="Type" /></Col>
      <Col><span className="fw-bold text-color-black">Owner:</span><DropdownOptions label="owner" placeholder="Owner by" /></Col>
    </Row>
  </div>
  );
}

export default Filter;
