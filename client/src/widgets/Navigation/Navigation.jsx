import React from "react";
import { useLocation, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router";

export default function Navigation({ setUser, user }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserPage = location.pathname === '/userPage' || location.pathname.includes('/album');

  // ЗАЩИТНАЯ ПРОВЕРКА - если user undefined, используем значения по умолчанию
  const safeUser = user || { status: "guest", data: null };

  const logoutHandler = async () => {
    try {
      // await UserApi.logout();
      setUser({ status: "guest", data: null });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  if (isUserPage) {
    return (
      <Navbar bg="white" expand="lg" className="border-bottom shadow-sm">
        <Container>
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link fw-bold">
              Главная
            </NavLink>
            <NavLink to="/userPage" className="nav-link">
              Страница профиля
            </NavLink>
            <NavLink to="/album" className="nav-link">
              Альбом
            </NavLink>
            <NavLink to="/ai" className="nav-link">
              Ai-генерация
            </NavLink>
          </Nav>
          
          <Navbar.Brand className="mx-auto position-absolute start-50 translate-middle-x">
            <span className="fs-4">
              {safeUser.status === "logged" ? safeUser.data?.name || safeUser.data?.email : "Гость"}
            </span>
          </Navbar.Brand>
          
          <Nav>
            <Button 
              variant="outline-danger" 
              onClick={logoutHandler}
              size="sm"
            >
              Выход
            </Button>
          </Nav>
        </Container>
      </Navbar>
    );
  }

  // Навигация для MainPage (главной)
  return (
    <Navbar bg="white" expand="lg" className="border-bottom py-3">
      <Container>
        <Navbar.Brand href="/" className="fs-3 fw-bold">
          📸 Memoria
        </Navbar.Brand>
        <Nav className="ms-auto">
          {safeUser.status !== "logged" ? (
            <>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/auth?tab=login')}
                className="me-2"
              >
                Войти
              </Button>
              <Button 
                variant="primary" 
                onClick={() => navigate('/auth?tab=signup')}
              >
                Регистрация
              </Button>
            </>
          ) : (
            <Button 
              variant="outline-secondary" 
              onClick={logoutHandler}
            >
              Выход
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
