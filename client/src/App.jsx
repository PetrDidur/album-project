import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import UserPage from "./pages/UserPage";
import AlbumPage from "./pages/AlbumPage";
import Layout from "./app/Layout/Layout";

function App() {
  // Добавьте состояние пользователя здесь
  const [user, setUser] = useState({ status: "guest", data: null });

  return (
    <BrowserRouter>
      <Routes>
        {/* Явно передайте user и setUser в Layout */}
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<MainPage user={user} />} />
          <Route path="/userPage" element={<UserPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
