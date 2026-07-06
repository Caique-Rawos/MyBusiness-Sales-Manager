import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://mybusiness-api.caiquerawos.com/',
  headers: { 'Content-Type': 'application/json' },
})

export default http
