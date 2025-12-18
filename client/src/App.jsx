




























import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainPage from "./pages/MainPage";
import Layout from "./app/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          {/* <Route path="/userPage" element={<UserPage />} /> */}
          {/* <Route path="/userPage/albumId" element={<AlbumPage />} /> */}
          {/* <Route path="/onegift/:giftId" element={<OneGiftPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
