import React from "react";
import { useNavigate } from "react-router";
import styles from "../ui/MainPage.module.css";

// ВРЕМЕННО: потом заменишь на селектор из стора / контекста
const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { user, isAuth: !!user };
};

export default function MainPage() {
  const navigate = useNavigate();
  const { user, isAuth } = useAuth();

  const handleStart = () => {
    if (isAuth) {
      navigate(`/user/${user.id}`);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.reload();
  };

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        
        <div className={styles.headerActions}>
          {!isAuth ? (
            <>
              <button onClick={() => navigate("/login")}>Войти</button>
              <button onClick={() => navigate("/register")}>Регистрация</button>
            </>
          ) : (
            <>
              <span className={styles.username}>{user.username}</span>
              <button onClick={handleLogout}>Выход</button>
            </>
          )}
        </div>
      </header>
      <main className={styles.content}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Добро пожаловать в <br /> MyPhotoAlbum
          </h1>

          <p className={styles.subtitle}>
            Создавайте личные фотоальбомы,
            <br />
            делитесь воспоминаниями с близкими
            <br />
            и экспериментируйте с AI-генерацией изображений
            <br />в одном удобном пространстве.
          </p>

          <button className={styles.startButton} onClick={handleStart}>
            Начать
          </button>
        </section>
      </main>
    </div>
  );
}
