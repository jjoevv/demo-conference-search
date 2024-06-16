import { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Button, Dropdown, NavDropdown} from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import useLocalStorage from '../../hooks/useLocalStorage'
import usePageNavigation from '../../hooks/usePageNavigation'
import HeaderNoti from '../Notifications/HeaderNoti'

import LoginExpiredModal from '../Modals/LoginExpiredModal'
import useAuth from '../../hooks/useAuth'
import AvatarDropdown from './AvatarDropdown'

const Header = () => {
  const { isExpiredLogin, isLogin, getCurrentUser } = useAuth()
  const { user } = useLocalStorage();
  const navigate = useNavigate()
  const { goToPreviousPage } = usePageNavigation()
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(null);
  useEffect(() => {
    //getCurrentUser()
    if (user === null) {
      navigate('/')
    }
    const event = new KeyboardEvent('keydown', {
      key: 'r',
      ctrlKey: true, // hoặc metaKey: true nếu bạn đang sử dụng trên MacOS
    });

    goToPreviousPage(event);
  }, [])


  const handleNavigate = (link) => {
    if (user) {
      navigate(link)
    }
    else navigate('/login')
  }

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
};

  return (
    <Navbar expand="md"
      id='header'
      className="bg-body-tertiary d-flex justify-content-between my-header w-100 fixed-top"

    >
      <LoginExpiredModal show={isLogin ? isExpiredLogin : false} />
      <Container fluid className='d-flex justify-content-between shadow-sm px-5'>
        <Navbar.Brand className='my-header-brand'>
          <Link to='/' className='mx-5 text-teal-dark fs-4 fw-bold' title='Homepage'>
            ConfHub
          </Link>
        </Navbar.Brand>
     
        <Nav activeKey={activeKey} onSelect={handleSelect} className="ms-auto d-flex align-items-center">
          
                <Nav.Link
                    as={Link}
                    to='/'
                    title='Homepage'
                    className={`mx-4 text-color-black fs-medium fw-bold header-title 
                      ${location.pathname === '/' ? 'border-3 border-bottom  border-secondary' : ''}`}
                >
                    Home
                </Nav.Link>
            <Dropdown  onMouseLeave={()=>setShowDropdown(false)}
                  onMouseEnter={()=>setShowDropdown(true)}
                  show={showDropdown}
                  >
              <Nav.Link className={`mx-4 text-color-black fs-medium fw-bold  header-title bg-transparent border-0 header-title
                  ${location.pathname.includes('/followed') || location.pathname.includes('/your') ? 'border-3 border-bottom  border-secondary' : ''}`} 
                 >
                Conference
              </Nav.Link>
                <Dropdown.Menu>
                  <NavDropdown.Item className='fs-6' onClick={() => handleNavigate('/user/followed')}>Followed Conferences</NavDropdown.Item>
                  <NavDropdown.Item className='fs-6' onClick={() => handleNavigate('/user/yourconferences')}>Your Conferences</NavDropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

                <Nav.Link
                    as={Link}
                    to={user ? '/user/note' : '/login'}
                    title='Timestamp'
                    className={`mx-4 text-color-black fs-medium fw-bold header-title 
                      ${location.pathname.includes('/note') ? 'border-3 border-bottom  border-secondary' : ''}`}
                >
                    Note
                </Nav.Link>
            <Nav.Item>
                <HeaderNoti />
            </Nav.Item>
            <Nav.Item>
                {user ?
                    <AvatarDropdown />
                    :
                    <Button className='bg-red-normal border-0 px-4 rounded-5 fw-bold ' onClick={() => navigate('/login')}>LOG IN</Button>
                }
            </Nav.Item>
        </Nav>
      </Container>

    </Navbar>
  )
}

export default Header