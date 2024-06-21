import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/custom_animation.css'
import './assets/styles/responsive.css'
import './i18n'; // Import cấu hình i18n
import { HashRouter} from 'react-router-dom'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'
import RoutesApp from './routes/RouteApp.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  return (
    <AppContextProvider>
      <HashRouter>
        <MainLayout />
        <RoutesApp/>
        <Footer/>
      </HashRouter>
    </AppContextProvider>
  )
}

export default App
