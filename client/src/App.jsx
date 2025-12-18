import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import Layout from "./app/Layout/Layout";
import AuthPage from "./pages/AuthPage";

function App() {
  const [user, setUser] = useState({ status: "logging", data: null });
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/register" element={<AuthPage setUser={setUser}/>} />
          <Route path="*" element={<h1>Нет контента</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
