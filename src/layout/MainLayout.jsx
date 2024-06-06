
import { useLocation, Outlet } from 'react-router-dom'
import usePageNavigation from '../hooks/usePageNavigation'
import Header from '../components/Header/Header'
import RoutesApp from '../routes/RouteApp'
import Footer from '../components/Footer/Footer'

const MainLayout = () => {
    const location = useLocation()
    usePageNavigation()
  return (
    <div className='overflow-x-hidden'>
        {
            location.pathname === '/login' || location.pathname === '/signup'
            ?
            null
            :
              <Header/>
            
        }
        <RoutesApp/>
        
        {!location.pathname.includes('user') && !location.pathname.includes('admin') && !location.pathname.includes('login') && !location.pathname.includes('signup') && <Footer/>}
        <Outlet/>
    </div>
  )
}

export default MainLayout