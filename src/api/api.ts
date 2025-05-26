import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true
})

//request interceptor
api.interceptors.request.use(
    (config) => {
       const token = localStorage.getItem('token')
       if (token) {
           config.headers.Authorization = `Bearer ${token}`
       }
       if(import.meta.env.VITE_ENV === 'DEV'){
           config.transformRequest = [(data) => data];
       }
       return config
    },
    (error) => Promise.reject(error)
)

//response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            console.warn('Unauthorized access-----logging out')
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api