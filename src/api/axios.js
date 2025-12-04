import axios from "axios";
import Cookies from "js-cookie";

const IP = import.meta.env.VITE_IP;
const TIMEOUT = import.meta.env.VITE_TIMEOUT;

export const api = axios.create({
  baseURL: IP,
  timeout: TIMEOUT,
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
    const token = Cookies.get("token");

    if (status === 401 && token !== undefined) {
      console.warn();

      if (popupHandler)
        popupHandler("Сессия истекла. Авторизуйтесь снова.", { type: "error" });
      if (logoutHandler) logoutHandler();
      if (navigateHandler) navigateHandler("/login");

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
