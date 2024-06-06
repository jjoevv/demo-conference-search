
import { Container, Stack, Image } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'

import test from '../../assets/imgs/location.png'

import useLocalStorage from '../../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser, faFileLines, faTableColumns, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'


const sidebar = [
  { path: `/admin/dashboard`, title: 'Dashboard', icon: <FontAwesomeIcon icon={faTableColumns} className='mx-2' /> },
  { path: '/admin/usersmanagement', title: 'Users', icon: <FontAwesomeIcon icon={faUsers} className='mx-2' />  },
  { path: '/admin/admin_account', title: 'Admin Account', icon: <FontAwesomeIcon icon={faUser} className='mx-2' />  },
  
]

const Sidebar = () => {
  const { user } = useLocalStorage()
  const location = useLocation()
  const [profile, setProfile] = useState(null)

  useEffect(()=>{
    if(user){
      setProfile(user)
    }
  },[user])

  return (
    <Container fluid className="my-sidebar">
      <Stack>
        {/* Sidebar */}
        <div className='text-center mt-5 pt-5'>
          <FontAwesomeIcon icon={faCircleUser} className='text-light' style={{fontSize: "100px"}}/>
        </div>
        <div className='text-center mt-2 text-light'>
          <h3 className='text-light'>{user? user.name : ''}</h3>
        </div>
        <Stack md={3} className="fixed-left">
          {
            sidebar.map(link => (
              <NavLink
                key={link.title}
                to={link.path}
                activeClassName="active"
                className={
                  location.pathname === link.path
                    ? 'my-sidebar-navlink ps-2 py-3 bg-primary-normal text-color-darker rounded-2'
                    : 'my-sidebar-navlink px-2 py-3 '}
              >

                {link.icon}
                {link.title}
              </NavLink>

            ))
          }
        </Stack>

      </Stack>
    </Container>
  )
}

export default Sidebar