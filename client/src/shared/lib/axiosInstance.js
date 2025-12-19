import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
  withCredentials: true,
  timeout: 10000, // 10 секунд таймаут
});

let accessToken = "";

function setAccessToken(newToken) {
  accessToken = newToken;
}

axiosInstance.interceptors.request.use((config) => {
  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // БЕЗОПАСНАЯ ПРОВЕРКА - сначала убедись что есть response
    if (!error.response) {
      // Нет ответа от сервера
      const networkError = new Error(
        error.message || 'Сервер не отвечает. Проверьте подключение к интернету.'
      );
      console.error('Network Error:', networkError.message);
      return Promise.reject(networkError);
    }

    const prevRequest = error.config;
    const { status } = error.response;
    
    // Только 403 ошибка и если запрос еще не переотправлялся
    if (status === 403 && prevRequest && !prevRequest._retry) {
      try {
        prevRequest._retry = true; // Помечаем что уже пытались обновить
        
        // Пытаемся обновить токены
        const response = await axiosInstance.post("/api/auth/refreshTokens", {}, {
          withCredentials: true
        });
        
        if (response.data.data?.accessToken) {
          accessToken = response.data.data.accessToken;
          prevRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(prevRequest);
        }
      } catch (refreshError) {
        console.error('Ошибка обновления токена:', refreshError);
        // Перенаправляем на логин если не в процессе логина/регистрации
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/signup')) {
          window.location.href = '/login?session=expired';
        }
      }
    }
    
    // Для других ошибок просто пробрасываем дальше
    return Promise.reject(error);
  }
);

export { setAccessToken };
export default axiosInstance;