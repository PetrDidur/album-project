import React from "react";
import Navigation from "../../widgets/Navigation/Navigation";
import { Outlet } from "react-router";
import Container from "react-bootstrap/Container";

export default function Layout() {
  return (
    <>
      <Container>
        <Navigation />
        <Outlet />
      </Container>
    </>
  );
}