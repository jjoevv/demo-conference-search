
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'

const AdvancedFilter = () => {
    return (
        <Row direction="horizontal" gap={3} className="w-100">
            <Col>
                <span className="fw-bold text-color-black">Rank</span>
                <Options label={"rank"}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black text-nowrap">Field of research</span>
                <Options label={"for"} />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Source</span>
                <Options label={"source"} />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Acronym</span>
                <Options label={"acronym"} />
            </Col>
           {/*<Col>
                <span className="fw-bold text-color-black">Rating</span>
                <StarDropdown label={'rating'} />
            </Col>* */} 
            {<Col>
                <span className="fw-bold text-color-black">Type</span>
                <Options label={"type"} />
            </Col>}

        </Row>
    )
}

export default AdvancedFilter