import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/custom.css'
import './assets/styles/custom_color.css'
import './assets/styles/custom_animation.css'
import './assets/styles/responsive.css'
import { BrowserRouter as Router, Routes, Route, HashRouter} from 'react-router-dom'

import MainLayout from './layout/MainLayout.jsx'
import { AppContextProvider } from './context/authContext.jsx'
import RoutesApp from './routes/RouteApp.jsx'
import Footer from './components/Footer/Footer.jsx'

function App() {
  return (
    <AppContextProvider>
      <Router  basename="/demo-conference-search/">
        <MainLayout />
        <RoutesApp/>
        <Footer/>
      </Router>
    </AppContextProvider>
  )
}

export default App
