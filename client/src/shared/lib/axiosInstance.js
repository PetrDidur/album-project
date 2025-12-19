import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
  withCredentials: true,
});

let accessToken = "";

function setAccessToken(newToken) {
  accessToken = newToken;
}

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error.config;
    if (error.response.status === 403 && !prevRequest.sent) {
      const response = await axiosInstance("/api/auth/refreshTokens");
      accessToken = response.data.data.accessToken;
      prevRequest.sent = true;
      prevRequest.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(prevRequest);
    }
    return Promise.reject(error);
  }
);

export { setAccessToken };

export default axiosInstance;