
import { Container, Stack, Image, Button } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleRight, faArrowCircleLeft, faBorderAll, faCircleUser, faFileLines, faTableColumns, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import './custom_sidebar.css'

const Sidebar = ({sidebar}) => {
  const { user } = useLocalStorage()
  const location = useLocation()
  const [profile, setProfile] = useState(null)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate()
  const toggleSidebar = () => {
      setIsCollapsed(!isCollapsed);
  };
  useEffect(()=>{
    if(user){
      setProfile(user)
    }
  },[user])

  return (
    <div className={`my-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {
            !isCollapsed && 
            <Button className='bg-transparent border-0 d-flex justify-content-center p-0 w-100' title='CONFHUB'
            onClick={()=>navigate('/')}>
              <h2 className='text-white text-center my-2'>CONFHUB</h2>
            </Button>

        }
      <Stack>
        {/* Sidebar */}
        <Stack md={3} className="fixed-left mt-5 mb-auto">
          {
            sidebar.map(link => (
              <NavLink
                key={link.title}
                to={link.path}
                activeClassName="active"
                className={
                  location.pathname.includes(link.path)
                    ? 'my-sidebar-navlink ps-2 py-3 bg-primary-normal  text-color-darker rounded-2'
                    : 'my-sidebar-navlink px-2 py-3 '}
              >

                {link.icon}
                {!isCollapsed && <span>{link.title}</span>}
                
              </NavLink>

            ))
          }
        </Stack>
      </Stack>
      <div className='d-flex justify-content-center'>
        <button onClick={toggleSidebar} className="w-100 bg-teal-dark text-white border-0 p-2 position-absolute" style={{bottom: "0px", height: "40px"}}>
                  {isCollapsed ? <FontAwesomeIcon icon={faArrowAltCircleRight} /> : <FontAwesomeIcon icon={faArrowCircleLeft} />}
        </button>
      </div>
    </div>
  )
}

export default Sidebar