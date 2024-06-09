import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/custom_animation.css'
import './assets/styles/responsive.css'
import { BrowserRouter, HashRouter} from 'react-router-dom'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'
import RoutesApp from './routes/RouteApp.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <MainLayout />
        <RoutesApp/>
        <Footer/>
      </BrowserRouter>
    </AppContextProvider>
  )
}

export default App
