import React from "react";
import styles from "./SignUpForm.module.css";
import UserValidate from "../../entities/user/api/UserValidate";
import UserApi from "../../entities/user/api/UserApi";
import { setAccessToken } from "../../shared/lib/axiosInstance";

function SignUpForm({ setUser }) {
  const signUpHandler = async (event) => {
    try {
      event.preventDefault();
      const formData = Object.fromEntries(new FormData(event.target));
      const { isValid, error } = UserValidate.validateSignUpData(formData);
      if (!isValid) return alert(error);
      const res = await UserApi.signup(formData);
      setUser({ status: "logged", data: res.data.user });
      setAccessToken(data.data.accessToken);
    } catch (error) {
      console.log(error);
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
