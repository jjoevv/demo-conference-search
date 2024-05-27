import {Routes, Route} from 'react-router-dom'

import Homepage from '../pages/public/Homepage'
import Login from '../pages/public/Login'
import Signup from '../pages/public/Signup'

import ErrorPage from '../pages/ErrorPage'


import Account from '../pages/auth/Account'
import Followed from '../pages/auth/Followed'
import YourConf from '../pages/auth/YourConf'
import Timestamp from '../pages/auth/Timestamp'
import Notifications from '../pages/auth/Notifications'
import { AuthLayout } from '../layout/AuthLayout'
import InformationPage from '../components/InformationPage/InformationPage'
import ImportantDatePage from '../components/InformationPage/ImportantDatePage'
import CallforpaperPage from '../components/InformationPage/CallforpaperPage'
import Setting from '../pages/auth/Setting'
import Dashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import { AdminLayout } from '../layout/AdminLayout'
import AdminAccount from '../pages/admin/AdminAccount'
import CallforPapers from '../pages/admin/CallforPapers'
import UserDetail from '../pages/admin/UserDetail'
import DetailedInformationPage from '../pages/public/DetailedInformationPage'

const authPage = [
  { path: 'account', element: <Account /> },
  { path: 'followed', element: <Followed /> },
  { path: 'yourconferences', element: <YourConf /> },
  { path: 'schedule', element: <Timestamp /> },
  { path: 'notifications', element: <Notifications /> },
  { path: 'setting', element: <Setting /> },
]

const admin = [
  { path: 'admin/dashboard', element: <Dashboard /> },
  { path: 'admin/usersmanagement', element: <Users /> },
  { path: 'admin/usersmanagement/userdetail/:id', element: <UserDetail /> },
  { path: 'admin/admin_account', element: <AdminAccount /> },
  { path: 'admin/callforpapers', element: <CallforPapers /> },
]

const RoutesApp = () => {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="home" element={<Homepage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="/detail/information/:id" element={<InformationPage />} />
      <Route path="/detailed-information/:id" element={<DetailedInformationPage />} />
      <Route path="/detail/importantdates/:id" element={<ImportantDatePage />} />
      <Route path="/detail/callforpaper/:id" element={<CallforpaperPage />} />

      <Route element={<AuthLayout />}>
        {
          authPage.map(page =>
            <Route
              key={page.path}
              path={page.path}
              element={page.element}
            />)
        }
      </Route>
      <Route element={<AdminLayout />}>
        {
          admin.map(page =>
            <Route
              key={page.path}
              path={page.path}
              element={page.element}
            />)
        }
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default RoutesApp