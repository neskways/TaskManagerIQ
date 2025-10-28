import { api } from "./axios";
import Cookies from "js-cookie";

/**
 * Авторизация пользователя
 * @param {string} login - Логин
 * @param {string} password - Пароль
 * @returns {Promise<{ token: string, userId: string, user: string, role: string }>}
 */
export const loginUser = async (login, password) => {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    const { User, Token, Role, UserId } = data;
    console.log(Role);
    Cookies.set("token", Token, { expires: 1 });
    Cookies.set("username", User ?? "Неизвестный пользователь", { expires: 1 });
    Cookies.set("userId", UserId, { expires: 1 });
    Cookies.set("role", Role ?? "Опущенный", { expires: 1 });

    return { token: Token, user: User ?? "", userId: UserId, role: Role ?? "" };
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
