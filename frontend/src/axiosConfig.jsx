import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // pass successful responses through
  (error) => {
    // Check if response exists and status is 401
    if (error.response?.status === 401) {
      alert("Session expired. Please log in again.");
      window.location.href = "/api/auth/login";
    }
    return Promise.reject(error); // still reject so individual calls can handle errors
  }
);

export default api;
