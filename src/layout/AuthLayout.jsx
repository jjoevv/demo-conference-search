import { Outlet } from "react-router-dom";

import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookBookmark, faCalendarMinus, faFileLines, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
export const AuthLayout = () => {
  const {user} = useAuth()

  const sidebar = [
    { path: `/user/account`, title: 'Account', icon: <FontAwesomeIcon icon={faUser} className="me-2"/> },
    { path: '/user/followed', title: 'Followed conferences', icon: <FontAwesomeIcon icon={faBookBookmark}className="me-2"/> },
    { path: '/user/yourconferences', title: 'Your conferences', icon: <FontAwesomeIcon icon={faFileLines}className="me-2"/>},
    { path: '/user/note', title: 'Note', icon: <FontAwesomeIcon icon={faCalendarMinus}className="me-2"/> },
    { path: '/user/notifications', title: 'Notifications', icon: <FontAwesomeIcon icon={faBell}className="me-2"/> },
    { path: '/user/setting', title: 'Setting', icon: <FontAwesomeIcon icon={faGear}className="me-2"/> },
  ]

  const protectedPaths = [
    '/user/account',
    '/user/followed',
    '/user/yourconferences',
    '/user/note',
    '/user/notifications',
    '/user/setting',
  ];

  useEffect(()=>{
    console.log({user})
  }, [user])
  
  return (
    <Container className="d-flex w-100 h-100 mw-100 p-0">
      <Sidebar sidebar={sidebar}/>
      <Outlet/>
    </Container>
  )
};
