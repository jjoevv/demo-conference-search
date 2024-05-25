
import { useLocation, Outlet, useNavigate } from 'react-router-dom'

import NavBarDetailPage from '../components/NavBarDetailPage'
import { useEffect } from 'react'
import usePageNavigation from '../hooks/usePageNavigation'
import Header from '../components/Header/Header'

const MainLayout = () => {
    const location = useLocation()
    usePageNavigation()
  return (
    <>
        {
            location.pathname === '/login' || location.pathname === '/signup'
            ?
            null
            :
              <Header/>
            
        }
        {location.pathname.includes("/detail/")&&<NavBarDetailPage/>}
        <Outlet/>

    </>
  )
}

export default MainLayout