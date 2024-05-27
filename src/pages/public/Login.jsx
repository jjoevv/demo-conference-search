import { useState } from 'react'
import { Container, Form, Button, ButtonGroup, Row, Col, Image, InputGroup } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

import googleIcon from './../../assets/imgs/google.png'
import useAuth from '../../hooks/useAuth'
import Loading from '../../components/Loading'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
const Login = () => {
    const { loading, handleLogin } = useAuth();
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState(false)
    const [error, setError] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false)
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
    const validateForm = () => {
        for (let key in account) {
            if (!account[key]) {
                return `${key} cannot be empty.`;
            }
        }
        if (account.password === '') {
            return "Passwords cannot be empty.";
        }
        return null;
    };
    const handleSubmit = async (e) => {
        e.preventDefault()

        setIsSubmit(true)
        const errorMsg = validateForm();
        if (errorMsg) {
            setError(errorMsg);
            return;
        } else {
            setError(null);
            const result = await handleLogin(account.email, account.password)

            setStatus(result.status)
            setMessage(result.message)

            if (result.status) {
                setIsSubmit(false)
                handleLogin(account.email, account.password)
            }
        }

    }
    const chooseSignup = () => {
        navigate('/signup')
    }
    const toggleShowPassword = () => {
        setShowPassword(!showpassword);
    };
    return (
        <Container className="100-w 100-h min-vh-100 d-flex justify-content-center align-items-center text-center" fluid={true} style={{ backgroundColor: "#C2F1EB" }} >
            <Row className='bg-white rounded-4 d-flex box-area w-75 h-50 mx-auto'>

                <Col className='p-1 d-flex flex-column align-items-center justify-content-center bg-skyblue-light rounded-start-4' >

                    <Form className='w-75 p-5 bg'>
                        <h1 className='mb-4 fw-bold' style={{ fontSize: "30px", color: "#419489" }}>Log In</h1>
                        <Button className='border-0 w-100 p-2 rounded-3' style={{ backgroundColor: "#E8F1F3", color: "#434343" }}>
                            <Image src={googleIcon} width={20} className="me-2" />
                            You can join with your Google account</Button>
                        <div className='d-flex flex-row align-items-center'>
                            <div style={{ flex: 1, height: '1px', backgroundColor: 'black' }} />

                            <div><p className='pt-3 mx-3'>or log in with your account</p></div>

                            <div style={{ flex: 1, height: '1px', backgroundColor: 'gray' }} />
                        </div>
                        <Form.Group className="mb-3 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{ fontSize: "20px", color: "#434343" }}>Email</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={account.email}
                                placeholder="name@example.com"
                                onChange={handleInputChange}
                                required
                                className="border-0 shadow-sm rounded-2 px-3 py-2"
                            />
                        </Form.Group>
                        <Form.Group className="mb-4 text-start">
                            <Form.Label htmlFor="inputPassword5" style={{ fontSize: "20px", color: "#434343" }}>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showpassword ? "text" : "password"}
                                    value={account.password}
                                    name="password"
                                    placeholder='Password'
                                    onChange={handleInputChange}
                                    required
                                    className="border-0 shadow-sm rounded-start-2 px-3 py-2"
                                />
                                <InputGroup.Text onClick={toggleShowPassword} className='border-0 bg-white rounded-end shadow-sm '>
                                    {showpassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <ButtonGroup className="d-flex justify-content-around mb-3">
                            <Button className='bg-transparent border-0 p-0' style={{ color: "#434343" }}>Forgot your password?</Button>
                        </ButtonGroup>
                        {
                            isSubmit && error && <p className="text-warning">{error}</p>
                        }
                        {
                            !status && isSubmit && message !== '' && <p className="text-danger">{message}</p>
                        }
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            

                            <Button
                                onClick={handleSubmit}
                                className='border-0 fw-bold rounded-4 p-2'
                                style={{ width: "140px", fontSize: "20px", backgroundColor: "#419489" }}>

                                {
                                    isSubmit && loading ?
                                        <Loading />
                                        :
                                        "LOG IN"
                                }
                            </Button>
                        </div>
                        <div className="my-3 mx-3 d-flex align-items-center justify-content-center">
                            <span htmlFor="#signup">{`Don't have an account?`}</span>
                            <Button
                                className='bg-transparent border-0 fw-bold p-0 m-0 w-25'
                                style={{ fontSize: "20px", color: "#419489" }}
                                onClick={chooseSignup}>
                                SIGN UP
                            </Button>
                        </div>
                    </Form>
                </Col>
                <Col sm={4} className='d-flex flex-column align-items-center justify-content-center rounded-end-4 text-light' style={{ backgroundColor: "#419489" }}>
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