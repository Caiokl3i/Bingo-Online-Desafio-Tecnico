import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor para colocar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de erro (opcional, mas poderoso)
api.interceptors.response.use(
  (response) => response.data, // Garante que o front receba direto o array/objeto
  (error) => Promise.reject(error)
);

export default api;
