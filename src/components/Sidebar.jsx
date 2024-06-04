
import { Container, Stack, Image } from 'react-bootstrap'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import test from './../assets/imgs/location.png'

import avatarIcon from '../assets/imgs/avatar_lg.png'
import useLocalStorage from '../hooks/useLocalStorage'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useToken from '../hooks/useToken'
import usePageNavigation from '../hooks/usePageNavigation'

const sidebar = [
  { path: `/account`, title: 'Account', icon: test },
  { path: '/followed', title: 'Followed Conferences', icon: test },
  { path: '/yourconferences', title: 'Your conferences', icon: test },
  { path: '/schedule', title: 'Note', icon: test },
  { path: '/notifications', title: 'Notifications', icon: test },
  { path: '/setting', title: 'Setting', icon: test },
]

const Sidebar = () => {
  const {user} = useLocalStorage()
  const location = useLocation()
  const navigate = useNavigate()
  usePageNavigation()
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
          <Image roundedCircle width={80} height={80} className='mx-auto' src={avatarIcon} />
        </div>
        {
          user
          &&
          <>
          <div className='text-center mt-2 text-light'>
          <h3 className='text-light'>{user.name? user.name : ''}</h3>
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
                    ? 'my-sidebar-navlink ps-2 py-3 fs-6 bg-primary-normal text-color-darker rounded-2'
                    : 'my-sidebar-navlink px-2 py-3 fs-6 '}
              >

                {link.title}
              </NavLink>

            ))
          }
        </Stack>
          </>
        }

      </Stack>
    </Container>
  )
}

export default Sidebar