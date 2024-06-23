import {Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/authContext";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBorderAll, faTableColumns, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

// ...


export const AdminLayout = () => {
  const {t} = useTranslation()
//{ path: '/admin/admin_account', title: 'Admin Account', icon: <FontAwesomeIcon icon={faUser} className='me-2' />  },
const sidebar = [
  { path: `/admin/dashboard`, title: t('Dashboard'), icon: <FontAwesomeIcon icon={faBorderAll} className='me-2' /> },
  { path: `/admin/conferences_management`, title: t('Conferences'), icon: <FontAwesomeIcon icon={faTableColumns} className='me-2' /> },
  { path: '/admin/users_management', title: t('Users'), icon: <FontAwesomeIcon icon={faUsers} className='me-2' /> },
];

  return (
    <Container className="d-flex w-100 mw-100 p-0">
          <Sidebar sidebar={sidebar}/>
          <Outlet/>
    </Container>
  )
};