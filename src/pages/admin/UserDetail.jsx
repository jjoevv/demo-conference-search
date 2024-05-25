import { useState, useEffect } from 'react'
import { Container,  Image, Row, Col } from 'react-bootstrap'



const Dashboard = () => {
  
  return (
    <Container
      fluid
      className='pt-5 bg-light main-container' style={{ paddingLeft: "350px" }}>

      <div className="d-flex justify-content-between align-items-center mb-3 content">
        <h4>Account</h4>
      </div>
      <Row className='m-3'>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
      </Row>
      <Row className='m-3'>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
      </Row>
      <Row className='m-3'>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
        <Col className='border rounded-1 p-3 m-2'>
        <div className='d-flex align-items-center mb-2'>
          <Image src width={18} height={18} className='me-3'/>
          Email:
        </div>
        <span className='ms-4'>example@gamil.com</span>
        </Col>
      </Row>
      
      <div className='mt-auto w-100  footer'>
        
      </div>
    </Container>
  )
}

export default Dashboard