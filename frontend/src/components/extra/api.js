import axios from "axios";
import getCookie from "./getCookie";
import setCookie from "./setCookie";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4000"
});

axiosInstance.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;

    if(error.response.status === 403 && !originalRequest._retry) {
    const token = getCookie('jwt')
    // const token = localStorage.getItem('refreshtoken')
    const {data} = await axiosInstance.get('http://localhost:4000/user/refresh', {headers: {'Authorization': `Bearer ${token}`}})
    originalRequest.setCookie('newjwt',token)
    originalRequest.setItem('token',data)

    return axiosInstance(originalRequest)

    }
    return Promise.reject("hierror")
})