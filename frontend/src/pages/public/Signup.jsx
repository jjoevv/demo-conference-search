import React, { useState } from 'react'
import { Container, Form, Button, ButtonGroup, Image, Row, Col } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import googleIcon from './../../assets/imgs/google.png'
import useAuth from '../../hooks/useAuth'

const Signup = () => {
    const {handleRegister} = useAuth()
    const [account, setAccount] = useState({
        email: "",
        password: "",
        confirm: "",
    })
    const [showpassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        const value = { ...account, [event.target.name]: event.target.value }
        setAccount(value)
    }
    const handleSignup = (e) => {
        e.preventDefault()
        handleRegister(account.email, account.password)
    }
    const chooseLogin = () => {
        navigate('/login')
    }
    return (
        <Container className="100-w 100-h min-vh-100 d-flex justify-content-center align-items-center text-center overflow-hiddenFover" fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className='bg-white rounded-4 d-flex box-area w-75 h-50 mx-auto'>
            <Col sm={4} className='d-flex flex-column align-items-center justify-content-center rounded-start-4 text-light' style={{backgroundColor: "#419489"}}>
                    <span className='h1 mb-2'>Hello!</span>
                    <span className='w-75'>Enter your personal details and start following conferences/magazines!</span>
                    <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className='fs-6 text-light'>  {"<  "}Back to Homepage</Link>
                    </div>
                </Col>
                <Col className='p-5 d-flex flex-column align-items-center justify-content-center' >

                <Form onSubmit={handleSignup} className='w-75 '>
                        <h1 className='mb-4 fw-bold' style={{fontSize: "30px", color: "#419489"}}>Create Account</h1>
                        <Button className='border-0 w-100 p-2' style={{backgroundColor: "#E8F1F3", color: "#434343"}}>
                        <Image src={googleIcon} width={20} className="me-2"/>
                            You can join with your Google account
                            </Button>
                        <div className='d-flex flex-row align-items-center'>
                            <div style={{flex: 1, height: '1px', backgroundColor: 'black'}} />

                            <div><p className='pt-3 mx-3'>or create  your account here</p></div>

                            <div style={{flex: 1, height: '1px', backgroundColor: 'gray'}} />
                        </div>
                        <Form.Group className="mb-2 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{fontSize: "18px", color: "#434343"}}>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={account.email}
                                placeholder="name@example.com"
                                onChange={handleInputChange}
                                required
                                style={{backgroundColor: "#F3FCFB", borderRadius: "15px", padding: "12px 16px"}}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4 text-start">
                        <Form.Label htmlFor="inputPassword5" style={{fontSize: "18px", color: "#434343"}}>Password</Form.Label>  
                            <Form.Control
                                type={showpassword ? "text" : "password"}
                                value={account.password}
                                name="password"
                                placeholder='Your password'
                                onChange={handleInputChange}
                                required
                                style={{backgroundColor: "#F3FCFB", borderRadius: "15px", padding: "12px 16px"}}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4 text-start">
                        <Form.Label htmlFor="inputPassword5" style={{fontSize: "18px", color: "#434343"}}>Confirm password</Form.Label>  
                            <Form.Control
                                type={showpassword ? "text" : "password"}
                                value={account.confirm}
                                name="confirm"
                                placeholder='Your password'
                                onChange={handleInputChange}
                                required
                                style={{backgroundColor: "#F3FCFB", borderRadius: "15px", padding: "12px 16px"}}
                            />
                        </Form.Group>
                        <Button 
                            type='submit' 
                            className='border-0 fw-bold rounded-3 p-2' 
                            style={{width: "140px", fontSize: "20px", backgroundColor: "#419489"}}>
                                
                                SIGN UP
                            </Button>
                        <div className="my-3  mx-5 d-flex align-items-center justify-content-center">
                            <span htmlFor="#signup">Already have an account?</span>
                            <Button
                                className='bg-transparent border-0 fw-bold'
                                style={{fontSize: "20px", color: "#419489"}}
                                onClick={chooseLogin}>
                                <span>LOG IN</span>
                            </Button>
                        </div>
                    </Form>
                </Col>
               
            </Row>
        </Container>
    )
}

export default Signup