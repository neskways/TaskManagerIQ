import axios from "axios";
import { MESSAGES } from "../modules/messages";

const IP = import.meta.env.VITE_IP;

export const api = axios.create({
  baseURL: IP,
  timeout: 600000,
});

let logoutHandler = null;
let navigateHandler = null;
let popupHandler = null;

export const registerAuthHandlers = ({ logout, navigate, popup }) => {
  logoutHandler = logout;
  navigateHandler = navigate;
  popupHandler = popup;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // === Токен недействителен ===
    if (status === 401) {
      console.warn();

      if (popupHandler) popupHandler(MESSAGES.invalidToken, { type: false, marginNone: true });
      if (logoutHandler) logoutHandler();
      if (navigateHandler) navigateHandler("/login");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
