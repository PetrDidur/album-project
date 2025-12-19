import React from "react";
import { useNavigate } from "react-router-dom"; 
import styles from "./SignUpForm.module.css";
import UserValidate from "../../entities/user/UserValidate";
import UserApi from "../../entities/user/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstance";

function SignUpForm({ setUser }) {
  const navigate = useNavigate(); 

  const signUpHandler = async (event) => {
    try {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));
      
    
      const apiData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      
      };
      
      const { isValid, error } = UserValidate.validateSignUpData(apiData);
      if (!isValid) return alert(error);
      
      const res = await UserApi.signup(apiData);
      
      // Установите пользователя и токен
      setUser({ status: "logged", data: res.data.user });
      setAccessToken(res.data.accessToken);
      
      // ПЕРЕНАПРАВЛЕНИЕ НА ГЛАВНУЮ СТРАНИЦУ
      navigate("/"); // или navigate("/", { replace: true })
      
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Ошибка регистрации");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={signUpHandler}>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Имя</div>
          <input className={styles.input} name="name" type="text" required />
        </div>
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Электронная почта</div>
          <input className={styles.input} name="email" type="email" required />
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
        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>Повторите пароль</div>
          <input
            className={styles.input}
            name="confirmPassword"
            type="password"
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Подтвердить
        </button>
      </form>
    </div>
  );
}

export default SignUpForm;