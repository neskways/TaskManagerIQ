import { api } from "./axios";

/**
 * Авторизация пользователя
 * @param {string} login - Логин или email
 * @param {string} password - Пароль
 * @returns {Promise<{ token: string, userId: string }>} Объект с токеном и ID пользователя
 */
export const loginUser = async (login, password) => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await api.post(
      `${BASE_URL}iqit/Logout`,
      {
        Name: login,
        Pass: password,
      },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      }
    );

    // заменяем одинарные кавычки на двойные, чтобы JSON.parse не упал
    const fixed = response.data.replace(/'/g, '"');

    const parsed = JSON.parse(fixed);

    if (Array.isArray(parsed) && parsed.length > 0) {
      const { User, Token } = parsed[0];
      return { token: Token, userId: User };
    } else {
      throw new Error("Некорректный формат ответа сервера");
    }
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("Неверный логин или пароль");
    } else if (error instanceof SyntaxError) {
      console.error(
        "Ошибка парсинга JSON:",
        error.message,
        "\nОтвет сервера:",
        error.response?.data
      );
      throw new Error("Некорректный ответ сервера (ошибка формата JSON)");
    } else {
      console.error("Ошибка при авторизации:", error);
      throw new Error("Ошибка сервера или сети");
    }
  }
};
