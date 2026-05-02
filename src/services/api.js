import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:3333'
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('session_token')
  if (token) config.headers['X-Authorization'] = token
  return config
})

export default API
