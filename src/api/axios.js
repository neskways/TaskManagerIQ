import axios from "axios";

const IP = import.meta.env.VITE_IP;

export const api = axios.create({
  baseURL: IP,
  timeout: 5000,
});
