import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
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
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} user={user} />
          <Route path="/register" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          {/* <Route path="/userPage" element={<UserPage />} /> */}
          {/* <Route path="/userPage/albumId" element={<AlbumPage />} /> */}
          {/* <Route path="/onegift/:giftId" element={<OneGiftPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
