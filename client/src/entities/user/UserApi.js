import axiosInstance from "../../shared/lib/axiosInstance";

const API_AUTH_URL = "/api/auth";
export default class UserApi {
  static async signup(userData) {
    const { data } = await axiosInstance.post(
      API_AUTH_URL + "/signup",
      userData
    );
    return data;
  }

  static async login(userData) {
    const { data } = await axiosInstance.post(
      API_AUTH_URL + "/login",
      userData
    );
    return data;
  }

  static async logout() {
    const { data } = await axiosInstance(API_AUTH_URL + "/logout");
    return data;
  }
}