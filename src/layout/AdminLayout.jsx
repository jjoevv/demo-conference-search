import {Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../context/authContext";
import { Container } from "react-bootstrap";
import Sidebar from "../components/admin/Sidebar";

// ...

export const AdminLayout = () => {

  return (
    <Container className="d-flex w-100 mw-100">
          <Sidebar/>
          <Outlet/>
    </Container>
  )
};