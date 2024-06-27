import { useEffect, useState } from 'react'
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap'
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

import MessagesUpdateNow from './MessagesUpdateNow'
import TranslationButton from '../TranslationButton/TranslationButton'

import './custom_header.css'
import { useTranslation } from 'react-i18next'
import useScreenSize from '../../hooks/useScreenSize'

const Header = () => {
  const { t} = useTranslation()
  const {windowWidth} = useScreenSize()
  const { isExpiredLogin, isLogin } = useAuth()
  const { user } = useLocalStorage();
  const navigate = useNavigate()
  const { goToPreviousPage } = usePageNavigation()
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(null);
  
  const {notifications, getAllNotifications, getNoticationById} = useNotification()
  
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
};
  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };
  const dropDirection = windowWidth <= 768 ? 'end' : 'bottom';
  return (
    <Navbar expand="md" id="header" className=" fixed-top px-5 shadow-sm bg-white">
    <LoginExpiredModal show={isLogin ? isExpiredLogin : false} />
    <Container className="d-flex justify-content-between align-items-center w-100 px-5 px-md-5 px-sm-2">
      <Navbar.Brand className="my-header-brand me-auto me-md-0">
        <Link to="/" className="text-teal-dark fs-4 fw-bold" title="Homepage">
          ConfHub
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
    </Container>
      <Nav activeKey={activeKey} onSelect={handleSelect} className='d-flex'>
        <Nav.Link
          as={Link}
          to="/"
          title="Homepage"
          className={` mx-md-4 text-nowrap text-color-black fs-5 fw-bold header-title ${location.pathname === '/' ? 'border-3 border-bottom border-secondary' : ''}`}
        >
          {t('home')}
        </Nav.Link>
        <Dropdown
          onMouseLeave={() => setShowDropdown(false)}
          onMouseEnter={() => setShowDropdown(true)}
          onClick={() => setShowDropdown(!showDropdown)}
            show={showDropdown}
            drop={dropDirection}
          className='dropdown'
        >
          <Dropdown.Toggle
            className={`mx-md-4 px-0 rounded-0 text-center text-color-black fs-5 fw-bold header-title bg-transparent border-0 ${location.pathname.includes('/followed') || location.pathname.includes('/your') ? 'text-center border-3 border-bottom border-secondary' : ''}`}
            
          >
            {t('conference')}
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item className="fs-6" onClick={() => navigate('/user/followed')}>{t('followed_conference')}</Dropdown.Item>
            <Dropdown.Item className="fs-6" onClick={() => navigate('/user/yourconferences')}>{t('your_conferences')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Nav.Link
          as={Link}
          to={user ? '/user/note' : '/login'}
          title="Timestamp"
          className={` mx-md-4 text-nowrap text-color-black fs-5 fw-bold header-title ${location.pathname.includes('/note') ? 'border-3 border-bottom border-secondary' : ''}`}
        >
         {t('note')}
        </Nav.Link>
        
        <Nav.Item className="d-flex align-items-center mx-2">
          <TranslationButton/>
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          <HeaderNoti notifications={notifications} onReadStatus={getNoticationById} onReloadlist={getAllNotifications} />
        </Nav.Item>
        <Nav.Item className="d-flex align-items-center">
          {user ? (
            <AvatarDropdown />
          ) : (
            <Button className="bg-red-normal border-0 px-4 rounded-5 fw-bold fs-5 text-nowrap" onClick={() => navigate('/login')}>{t('login').toUpperCase()}</Button>
          )}
        </Nav.Item>
      </Nav>
          <MessagesUpdateNow/>
  </Navbar>
  )
}

export default Header