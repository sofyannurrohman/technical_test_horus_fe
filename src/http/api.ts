import axios, { type AxiosInstance } from 'axios';


const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export default api;
