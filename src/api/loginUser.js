import { api } from "./axios";
import Cookies from "js-cookie";

export const loginUser = async (login, password) => {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const TOKEN_LIFETIME = Number(import.meta.env.VITE_TOKEN_LIFETIME) || 0.6;

  try {
    const response = await api.post(
      `${BASE_URL}/Auth`,
      { Name: login, Pass: password },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);
    const data = Array.isArray(parsed) ? parsed[0] : parsed;

    if (!data || typeof data !== "object") {
      throw new Error("Некорректный формат ответа сервера");
    }

    const { User, Token, Role, UserCode } = data;

    Cookies.set("token", Token, { expires: TOKEN_LIFETIME });
    Cookies.set("username", User ?? "Неизвестный пользователь", { expires: TOKEN_LIFETIME });
    Cookies.set("userCode", UserCode, { expires: TOKEN_LIFETIME });
    Cookies.set("role", Role ?? import.meta.env.VITE_TOKEN_EMPLOYEE, { expires: TOKEN_LIFETIME });

    return { token: Token, user: User ?? "", userCode: UserCode, role: Role ?? "" };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("Неверный логин или пароль");
    } else if (error instanceof SyntaxError) {
      console.error("Ошибка парсинга JSON:", error.message);
      throw new Error("Некорректный ответ сервера (ошибка формата JSON)");
    } else {
      console.error("Ошибка при авторизации:", error);
      throw new Error("Ошибка сервера или сети");
    }
  }
};
