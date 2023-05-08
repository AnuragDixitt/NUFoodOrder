import axios from "axios";
import getCookie from "./getCookie";
import setCookie from "./setCookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    const stat = error.response.status;
    if (stat === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = getCookie("refresh");
      await axios.get("http://localhost:4000/user/refresh", {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(async (response) => {
          setCookie("jwt", response.data);
          originalRequest.headers.Authorization = `Bearer ${response.data}`;
        })
        .catch(function (error) {
          console.log("Error", error.message);
        });
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
