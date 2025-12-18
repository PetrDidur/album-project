import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router";
import UserApi from "../../entities/user/api/UserApi";

export default function Navigation({ setUser, user }) {
  const logoutHandler = async () => {
    try {
      await UserApi.logout();
      setUser({ status: "guest", data: null });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>
          {user.status === "logged" ? user.data.name : "Про подарки"}
        </Navbar.Brand>
        <Nav className="me-auto">
          <NavLink to="/" className="nav-link">
            Главная
          </NavLink>
          <NavLink to="/gifts" className="nav-link">
            Подарки
          </NavLink>
          <NavLink to="/dolphin" className="nav-link">
            Дельфины
          </NavLink>
        </Nav>
        {user.status !== "logged" && (
          <NavLink
            to="/register"
            className="nav-link"
            style={{ color: "white" }}
          >
            Вход
          </NavLink>
        )}

        {user.status === "logged" && (
          <Button onClick={logoutHandler}>Выход</Button>
        )}
      </Container>
    </Navbar>
  );
}
