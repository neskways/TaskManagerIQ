import { api } from "./axios";

/**
 * @returns {Promise<void>}
 */
export const logoutUser = async (token) => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    // отправляем токен на сервер для выхода
    await api.post(
      `${BASE_URL}/Logout`,
      { Token: token },
      {
        headers: { "Content-Type": "application/json" },
        responseType: "text",
      }
    );

    console.log("Пользователь успешно вышел из системы, токен успешно удален!");
  } catch (error) {
    console.error("Ошибка передачи токена на сервер:", error);
    throw new Error("Не удалось выйти. Проверьте соединение с сервером.");
  }
};
