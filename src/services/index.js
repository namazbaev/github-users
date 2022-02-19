import axios from "axios";
const token = localStorage.getItem('token');
const http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})

http.interceptors.request.use((config) => {
    config.headers['Authorization'] = token
    return config
})
export default http