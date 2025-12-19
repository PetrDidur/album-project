import React from "react";
import Navigation from "../../widgets/Navigation/Navigation";
import { Outlet } from "react-router";
import Container from "react-bootstrap/Container";

// Добавьте параметры функции
export default function Layout({ setUser, user }) {
  return (
    <>
      <Navigation setUser={setUser} user={user} />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}
