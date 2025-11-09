import { api } from "../axios";
import Cookies from "js-cookie";

export const createComment = async ({ taskid, comment }) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");
    const userid = Cookies.get("userCode");

    const response = await api.post(
      `${BASE_URL}/AddTaskComment`,
      {
        token,
        taskid,
        userid,
        comment,
      },
      { responseType: "text" }
    );

    return response;
    
  } catch (error) {
    console.error("Ошибка при создании комментария:", error);
    throw error;
  }
};
