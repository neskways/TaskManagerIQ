import { api } from "../axios";
import Cookies from "js-cookie";

export const getTasksList = async (states) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const response = await api.post(
      `${BASE_URL}/GetTasksList`,
      { Token: token,
        State: states
       },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    if (!Array.isArray(parsed)) {
      throw new Error("Unexpected response format: not an array");
    }

    return parsed.map((item) => ({
      number: item.TaskID,
      title: item.Name,
      client: item.Client,
      status: item.status,
      executor: item.user,
      priority: "", // пока нет данных
      timeSpent: item.time,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
    throw error;
  }
};
