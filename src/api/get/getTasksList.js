import { api } from "../axios";
import Cookies from "js-cookie";

export const getTasksList = async (states, handleInvalidToken) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const response = await api.post(
      `${BASE_URL}/GetTasksList`,
      { Token: token, State: states },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    if (!Array.isArray(parsed)) {
      throw new Error("Не верный формат возвращаемых данные!");
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

    if (error.response?.status === 400) {
      console.log("Не актуальный токен, необходима повторная авторизация!");
      if (handleInvalidToken) handleInvalidToken();
    else {
      console.error("Ошибка при загрузке расписания:", error);
    }
    }

    throw error;
  }
};
