import { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Button, Dropdown, NavDropdown } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
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
const Header = () => {
  
  const { isExpiredLogin, isLogin, getCurrentUser } = useAuth()
  const { user } = useLocalStorage();
  const navigate = useNavigate()
  const { goToPreviousPage } = usePageNavigation()
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(null);
  
  const [showPopupCrawl, setShowPopupCrawl] = useState(false)
  const {socketRef, notifications, message,setMessageNoti, getAllNotifications, getNoticationById} = useNotification()
  const [showDislayMessage, setShowDisplayMessage] = useState(null)
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


  useEffect(() => {
    if (message !== '') {
      setShowDisplayMessage(message)
      setShowPopupCrawl(true);
      let ids = sessionStorage.getItem('confIDs');
      const test = ids && ids?.includes(message?.id)

      if (test) {
        if (ids) {
          // Chuyển đổi danh sách IDs thành mảng
          ids = JSON.parse(ids);

          // Xóa ID cần xóa khỏi danh sách
          const index = ids.indexOf(message?.id);
          if (index !== -1) {
            ids.splice(index, 1);
          }
          
          // Cập nhật lại danh sách vào sessionStorage
          sessionStorage.setItem('confIDs', JSON.stringify(ids));
        }
      }
      const timer = setTimeout(() => {
        setShowPopupCrawl(false);
        setShowDisplayMessage(null)
        
      }, 10000);

      // Clear timeout khi component unmount hoặc stateToWatch thay đổi
      return () => clearTimeout(timer);
    }
  }, [message])


  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };

  const handleNavigate = () => {
    navigate(`/detailed-information/${showDislayMessage?.id}`)
    window.location.reload()
  }
  return (
    <Navbar expand="md" id="header" className="bg-body-tertiary vw-100 fixed-top px-5">
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
        <Nav.Item className="d-flex align-items-center">
          <HeaderNoti notifications={notifications} onReadStatus={getNoticationById} onReloadlist={getAllNotifications} />
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          {user ? (
            <AvatarDropdown />
          ) : (
            <Button className="bg-red-normal border-0 px-4 rounded-5 fw-bold" onClick={() => navigate('/login')}>LOG IN</Button>
          )}
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
   
    {showPopupCrawl && showDislayMessage && (
       <div className="message-popup">
       <div className='message-name overflow-hidden text-nowrap me-1 fw-bold'>
         {`${showDislayMessage?.name} `}
         
         </div>
         has been updated. 
       <Button
       onClick={handleNavigate}
        className='text-decoration-underline bg-transparent border-0 p-0 ps-1'>Click to view details</Button>
     </div>
    )}
  </Navbar>
  )
}

export default Header