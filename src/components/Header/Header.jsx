import { useEffect } from 'react'
import { Navbar, Container, Nav, Button, Dropdown,  } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AvatarDropdown from './AvatarDropdown'
import useLocalStorage from '../../hooks/useLocalStorage'
import usePageNavigation from '../../hooks/usePageNavigation'
import HeaderNoti from '../Notification/HeaderNoti'
import useNotification from '../../hooks/useNotification'
const Header = () => {
  const {user} = useLocalStorage();
  const navigate = useNavigate()
  const {goToPreviousPage} = usePageNavigation()
const {notifications}  = useNotification()
  useEffect(()=>{ 
    if (user === null){
      navigate('/home')
    }
      const event = new KeyboardEvent('keydown', {
        key: 'r',
        ctrlKey: true, // hoặc metaKey: true nếu bạn đang sử dụng trên MacOS
      });
      
      goToPreviousPage(event);
  },[])

  useEffect(()=>{
    
  }, [notifications])


  const handleNavigate = (link) => {
    if(user){
      navigate(link)
    }
    else navigate('/login')
  }
  return (
    <Navbar expand="md" 
    id='header'
    className="bg-body-tertiary d-flex justify-content-between my-header w-100 fixed-top"
    
    >
      <Container fluid className='d-flex justify-content-between shadow-sm px-5'>
        <Navbar.Brand className='my-header-brand'>
          <Link to='/' className='mx-4 text-teal-dark fs-4 fw-bold' title='Homepage'>
              ConfHub
            </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Link to='/' className='mx-4 text-body-emphasis text-color-black fs-6' title='Homepage'>
              Home
            </Link>
            <Dropdown>
              <Dropdown.Toggle className='bg-transparent text-color-black border-0 fs-6'>
                Conferences
              </Dropdown.Toggle>
        
              <Dropdown.Menu>
                <Dropdown.Item className='fs-6' onClick={()=>handleNavigate('/followed')}>Followed Conferences</Dropdown.Item>
                <Dropdown.Item className='fs-6' onClick={()=>handleNavigate('/yourconferences')}>Your Conferences</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            

            <Link to={user ? '/schedule' : '/login'} className='mx-4 text-body-emphasis text-color-black fs-6' title='Timestamp'>
              Schedule
            </Link>
            <HeaderNoti/>


            {
              user ?
                <AvatarDropdown/>
                :
                <Button className='bg-red-normal border-0 px-4 rounded-5 fw-bold' onClick={() => navigate('/login')}>LOG IN</Button>
            }

          </Nav>

        </Navbar.Collapse>        
      </Container>
     
    </Navbar>
  )
}

export default Header