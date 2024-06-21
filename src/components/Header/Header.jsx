import { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Button, Dropdown, NavDropdown } from 'react-bootstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import useLocalStorage from '../../hooks/useLocalStorage'
import usePageNavigation from '../../hooks/usePageNavigation'
import HeaderNoti from '../Notifications/HeaderNoti'

import LoginExpiredModal from '../Modals/LoginExpiredModal'
import useAuth from '../../hooks/useAuth'
import AvatarDropdown from './AvatarDropdown'
import useNotification from '../../hooks/useNotification'
import { getNotifications } from '../../actions/notiAction'

import './custom_header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import useConference from '../../hooks/useConferences'
import MessagesUpdateNow from './MessagesUpdateNow'
const Header = () => {
  
  const { isExpiredLogin, isLogin, getCurrentUser } = useAuth()
  const { user } = useLocalStorage();
  const navigate = useNavigate()
  const { previousPath ,goToPreviousPage } = usePageNavigation()
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(null);
  
  const [showPopupCrawl, setShowPopupCrawl] = useState(false)
  const {socketRef, notifications, message,setMessageNoti, getAllNotifications, getNoticationById} = useNotification()
  const [showDislayMessage, setShowDisplayMessage] = useState(null)
  const conf_id = useParams()
  
  useEffect(() => {
   // getCurrentUser()
    getNotifications()
    if (user === null) {
      navigate('/')
    }
    const event = new KeyboardEvent('keydown', {
      key: 'r',
      ctrlKey: true, // hoặc metaKey: true nếu bạn đang sử dụng trên MacOS
    });

    goToPreviousPage(event);
  }, [])




  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };

  return (
    <Navbar expand="md" id="header" className=" vw-100 fixed-top px-5 shadow-sm bg-white">
    <LoginExpiredModal show={isLogin ? isExpiredLogin : false} />
    <Container className="d-flex justify-content-between align-items-center w-100 px-5 px-md-5 px-sm-2">
      <Navbar.Brand className="my-header-brand me-auto me-md-0">
        <Link to="/" className="text-teal-dark fs-4 fw-bold" title="Homepage">
          ConfHub
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Container>
    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
      <Nav activeKey={activeKey} onSelect={handleSelect} className="d-flex align-items-center">
        <Nav.Link
          as={Link}
          to="/"
          title="Homepage"
          className={`mx-2 mx-md-4 text-color-black fs-medium fw-bold header-title ${location.pathname === '/' ? 'border-3 border-bottom border-secondary' : ''}`}
        >
          Home
        </Nav.Link>
        <Dropdown
          onMouseLeave={() => setShowDropdown(false)}
          onMouseEnter={() => setShowDropdown(true)}
          show={showDropdown}
        >
          <Dropdown.Toggle
            className={`mx-2 mx-md-4 text-color-black fs-medium fw-bold header-title bg-transparent border-0 ${location.pathname.includes('/followed') || location.pathname.includes('/your') ? 'border-3 border-bottom border-secondary' : ''}`}
            id="dropdown-basic"
          >
            Conference
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item className="fs-6" onClick={() => navigate('/user/followed')}>Followed Conferences</Dropdown.Item>
            <Dropdown.Item className="fs-6" onClick={() => navigate('/user/yourconferences')}>Your Conferences</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Nav.Link
          as={Link}
          to={user ? '/user/note' : '/login'}
          title="Timestamp"
          className={`mx-2 mx-md-4 text-color-black fs-medium fw-bold header-title ${location.pathname.includes('/note') ? 'border-3 border-bottom border-secondary' : ''}`}
        >
          Note
        </Nav.Link>
        
        <Nav.Item className="d-flex align-items-center mx-2">
          <Button className='bg-transparent border-0 p-0'>
            <FontAwesomeIcon icon={faLanguage} className='text-primary-normal fs-medium'/>
          </Button>
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          <HeaderNoti notifications={notifications} onReadStatus={getNoticationById} onReloadlist={getAllNotifications} />
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          {user ? (
            <AvatarDropdown />
          ) : (
            <Button className="bg-red-normal border-0 px-4 rounded-5 fw-bold text-nowrap" onClick={() => navigate('/login')}>LOG IN</Button>
          )}
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
          <MessagesUpdateNow/>
  </Navbar>
  )
}

export default Header