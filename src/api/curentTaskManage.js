import { api } from "./axios";
import Cookies from "js-cookie";

export const curentTaskManage = async (taskId, state) => {
  try {
    const token = Cookies.get("token");
    const userId = Cookies.get("userCode");

    const response = await api.post(
      `${import.meta.env.VITE_API_BASE_URL}/CurentTaskManage`,
      {
        token,
        userid: userId,
        taskid: taskId,
        state,
      },
      {
        transformResponse: [(data) => data], // запретить авто-JSON парсинг
        responseType: "text",
      }
    );

    return response;
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    throw error;
  }
};
