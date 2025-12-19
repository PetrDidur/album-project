import React, { useState } from "react"; // Добавьте useState
import { useNavigate } from "react-router";
import styles from "./LoginForm.module.css";
import UserValidate from "../../entities/user/UserValidate";
import UserApi from "../../entities/user/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstance";

function LoginForm({ setUser }) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибок

  const loginHandler = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Сбрасываем ошибки
    
    try {
      const formData = Object.fromEntries(new FormData(event.target));
      
      // Валидация
      const { isValid, error } = UserValidate.validateLoginData(formData);
      if (!isValid) {
        setErrorMessage(error);
        return;
      }
      
      console.log("Отправка данных для входа:", formData);
      
      const res = await UserApi.login(formData);
      console.log("Ответ сервера:", res.data);
      
      setUser({ status: "logged", data: res.data.user });
      setAccessToken(res.data.accessToken);
      
      navigate("/");
      
    } catch (error) {
      console.error("Ошибка входа:", error);
      
      // Детальная информация об ошибке
      if (error.response) {
        // Сервер ответил с ошибкой
        console.error("Статус ошибки:", error.response.status);
        console.error("Данные ошибки:", error.response.data);
        
        const serverError = error.response.data;
        setErrorMessage(
          serverError.message || 
          serverError.error || 
          `Ошибка ${error.response.status}: ${JSON.stringify(serverError)}`
        );
      } else if (error.request) {
        // Запрос был сделан, но ответа нет
        console.error("Нет ответа от сервера");
        setErrorMessage("Сервер не отвечает. Проверьте подключение.");
      } else {
        // Ошибка при настройке запроса
        console.error("Ошибка настройки запроса:", error.message);
        setErrorMessage(`Ошибка: ${error.message}`);
      }
    }
  };
  
  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={loginHandler}>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Электронная почта</div>
          <input 
            className={styles.input} 
            name="email" 
            type="email" 
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Пароль</div>
          <input
            className={styles.input}
            name="password"
            type="password"
            required
          />
        </div>

        {/* Отображение ошибки */}
        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        <button type="submit" className={styles.submitButton}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default LoginForm;