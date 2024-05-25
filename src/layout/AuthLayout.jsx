import { Outlet } from "react-router-dom";

import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
export const AuthLayout = () => {
  return (
    <Container className="d-flex w-100 h-100 mw-100">
      <Sidebar/>
      <Outlet/>
    </Container>
  )
};
