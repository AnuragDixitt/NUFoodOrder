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
    console.log("in refresh trying token", originalRequest._retry, stat);
    if (stat === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      // console.log("in api frontend");
      const token = getCookie("refresh");
      // console.log("token hererere", token);
      const data = await axios.post("http://localhost:4000/user/refresh", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (response) => {
          // data = response
          // console.log(data)
          console.log("ohyeaaa", response.data);
          // setCookie("newJwt", response);
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          // originalRequest.setItem("token", response);
        })
        .catch(function (error) {
          console.log("Error", error.message);
        });
      // console.log("nhk", data);
      return axiosInstance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
