import axios from "axios";

// базовый axios instance
export const api = axios.create({
  baseURL: "http://192.168.11.99", // меняется только здесь
  timeout: 10000, // опционально: таймаут запросов
});