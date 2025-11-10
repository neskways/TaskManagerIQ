import { api } from "../axios";
import Cookies from "js-cookie";

export const getTasksList = async (
  states,
  userCode,
  firstline,
  handleInvalidToken,
  clientId // 🔹 добавили параметр
) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    // 🔹 Собираем тело запроса динамически
    const payload = {
      Token: token,
      State: states,
      userid: userCode,
      firstline: firstline,
    };

    if (clientId) {
      payload.ClientId = clientId; // передаём, только если выбран клиент
    }

    const response = await api.post(`${BASE_URL}/GetTasksList`, payload, {
      responseType: "text",
    });

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    if (!Array.isArray(parsed)) {
      throw new Error("Неверный формат возвращаемых данных!");
    }

    return parsed.map((item) => ({
      number: item.TaskID,
      title: item.Name,
      client: item.Client,
      status: item.status,
      executor: item.user,
      priority: "",
      timeSpent: item.time,
    }));
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("Не актуальный токен, необходима повторная авторизация!");
      if (handleInvalidToken) handleInvalidToken();
    } else {
      console.error("Ошибка при загрузке задач:", error);
    }
    throw error;
  }
};
