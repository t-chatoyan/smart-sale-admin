import axios from 'axios'

export const baseURL = process.env.VUE_APP_API_URL;

const http = axios.create({
  baseURL,
  withCredentials: false
})

http.interceptors.request.use((config) => {
  if (localStorage.access_token) {
    config.headers.Authorization = `Bearer ${localStorage.access_token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

http.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401) {
    localStorage.clear()
  }
  return Promise.reject(error)
})

export {
  http
}
