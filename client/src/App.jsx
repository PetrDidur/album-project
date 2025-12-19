import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage";
import AlbumPage from "./pages/AlbumPage";
import Layout from "./app/Layout/Layout";
import SignUpForm from "./features/SignUpForm/SignUpForm";
import UserApi from "./entities/user/UserApi";
import axiosInstance, { setAccessToken } from "./shared/lib/axiosInstance";
import LoginForm from "./features/LoginForm/LoginForm";

function App() {
  const [user, setUser] = useState({ status: "logging", data: null });

 useEffect(() => {
  axiosInstance("/api/auth/refreshTokens")
    .then(({ data }) => {
      setUser({ status: "logged", data: data.data.user });
      setAccessToken(data.data.accessToken);
    })
    .catch(() => {
      setUser({ status: "guest", data: null });
      setAccessToken("");
    });
}, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Явно передайте user и setUser в Layout */}
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<MainPage user={user} />} />
          <Route path="/userPage" element={<UserPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/" element={<MainPage />} user={user} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
