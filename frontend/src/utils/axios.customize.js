import axios from 'axios';

// set config defaults when creating the instance
const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// alter defaults after instance is created
// add a request interceptor
instance.interceptors.request.use(function (config) {
    // do sth b4 the req is sent
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // do sth with the error
    return Promise.reject(error);
});

// add a response interceptor
instance.interceptors.response.use(function (response) {
    // any status code that lies within the range of 2xx causes this function to trigger
    // do sth with the res data
    if (response && response.data) return response;
}, function (error) {
    // any status codes that falls outside the range of 2xx causes this function to trigger
    // do sth with the error
    return Promise.reject(error);
});

export default instance;