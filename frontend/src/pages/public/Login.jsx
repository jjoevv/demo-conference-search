import React, { useState } from 'react'
import { Container, Form, Button, ButtonGroup, Stack, Row, Col, Image } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import googleIcon from './../../assets/imgs/google.png'
import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'
const Login = () => {
    const {loading, error, handleLogin, handleLogout } = useAuth();
    
    const [account, setAccount] = useState({
        email: "",
        password: "",
    })
    const [showpassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleInputChange = (event) => {
        const value = { ...account, [event.target.name]: event.target.value }
        setAccount(value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin(account.email, account.password)
    
    }
    const chooseSignup = () => {
        navigate('/signup')
    }
    return (
        <Container className="100-w 100-h min-vh-100 d-flex justify-content-center align-items-center text-center" fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className='bg-white rounded-4 d-flex box-area w-75 h-50 mx-auto'>
                
                <Col className='p-1 d-flex flex-column align-items-center justify-content-center ' >

                    <Form onSubmit={handleSubmit} className='w-75 p-5'>
                        <h1 className='mb-4 fw-bold' style={{fontSize: "30px", color: "#419489"}}>Log In</h1>
                        <Button className='border-0 w-100 p-2 rounded-3' style={{backgroundColor: "#E8F1F3", color: "#434343"}}>
                            <Image src={googleIcon} width={20} className="me-2"/>
                            You can join with your Google account</Button>
                        <div className='d-flex flex-row align-items-center'>
                            <div style={{flex: 1, height: '1px', backgroundColor: 'black'}} />

                            <div><p className='pt-3 mx-3'>or log in with your account</p></div>

                            <div style={{flex: 1, height: '1px', backgroundColor: 'gray'}} />
                        </div>
                        <Form.Group className="mb-3 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{fontSize: "20px", color: "#434343"}}>Email</Form.Label>
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
                        <Form.Label htmlFor="inputPassword5" style={{fontSize: "20px", color: "#434343"}}>Password</Form.Label>  
                            <Form.Control
                                type={showpassword ? "text" : "password"}
                                value={account.password}
                                name="password"
                                placeholder='Password'
                                onChange={handleInputChange}
                                required
                                style={{backgroundColor: "#F3FCFB", borderRadius: "15px", padding: "12px 16px"}}
                            />
                        </Form.Group>
                        <ButtonGroup className="d-flex justify-content-around mb-3">
                            <Button className='bg-transparent border-0 p-0' style={{color: "#434343"}}>Forgot your password?</Button>
                        </ButtonGroup>
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            {error && <span className='text-danger'>{error}</span>}
                            {loading && <Loading/>}
                                <Button
                                    type='submit'
                                    className='border-0 fw-bold rounded-4 p-2'
                                    style={{width: "140px", fontSize: "20px", backgroundColor: "#419489"}}>
                            
                                    LOG IN
                                </Button>
                        </div>
                        <div className="my-3 mx-3 d-flex align-items-center justify-content-center">
                            <span htmlFor="#signup">Don't have an account?</span>
                            <Button
                                className='bg-transparent border-0 fw-bold p-0 m-0 w-25'
                                style={{fontSize: "20px", color: "#419489"}}
                                onClick={chooseSignup}>
                                SIGN UP
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col sm={4} className='d-flex flex-column align-items-center justify-content-center rounded-end-4 text-light' style={{backgroundColor: "#419489"}}>
                    <span className='h1 mb-2'>Welcome Back!</span>
                    <span className='mt-3'>Enter your personal account and keep following conferences/magazines!</span>

                    <div className=' border border-1 p-2 mt-5 border-white rounded-2'>
                        <Link to='/' className='fs-6 text-light'>  {"<  "}Back to Homepage</Link>
                    </div>
                </Col>
            </Row>
            
        </Container>
    )
}

export default Login