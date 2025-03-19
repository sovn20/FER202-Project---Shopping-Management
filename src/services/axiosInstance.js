import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance; // Xuất khẩu theo cú pháp ES Modules
