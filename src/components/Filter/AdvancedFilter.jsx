import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Options from './Options'
import StarDropdown from './StarDropdown'

const AdvancedFilter = ({onApply}) => {
    return (
        <Row direction="horizontal" gap={3} className="w-100">
            <Col>
                <span className="fw-bold text-color-black">Rank</span>
                <Options label={"rank"} onApply={onApply}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black text-nowrap">Field of research</span>
                <Options label={"for"}  onApply={onApply}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Source</span>
                <Options label={"source"}  onApply={onApply}/>
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Acronym</span>
                <Options label={"acronym"} onApply={onApply} />
            </Col>
            <Col>
                <span className="fw-bold text-color-black">Rating</span>
                <StarDropdown label={'rating'} onApply={onApply} />
            </Col>
            {<Col>
                <span className="fw-bold text-color-black">Type</span>
                <Options label={"type"} onApply={onApply} />
            </Col>}

        </Row>
    )
}

export default AdvancedFilter