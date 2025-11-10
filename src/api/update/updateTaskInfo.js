import { api } from "../axios";
import Cookies from "js-cookie";

export const updateTaskInfo = async (taskId, state, ownerId) => {
  try {
    const token = Cookies.get("token");
    const userId = Cookies.get("userCode");

    const response = await api.post(
      `${import.meta.env.VITE_API_BASE_URL}/UpdateTaskStatus`,
      {
        token,
        userid: userId,
        taskid: String(taskId).padStart(9, "0"),
        state,
        owner: ownerId,
      },
      {
        transformResponse: [(data) => data], 
        responseType: "text",
      }
    );

    return response;
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
    throw error;
  }
};
