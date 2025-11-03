import { api } from "../axios";
import Cookies from "js-cookie";

export const getTaskInfo = async (taskID, handleInvalidToken) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const formattedTaskID = taskID.toString().padStart(9, "0");

    const response = await api.post(
      `${BASE_URL}/GetTaskInfo`,
      {
        Token: token,
        TaskId: formattedTaskID,
      },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Unexpected response format");
    }

    const dateParts = parsed.date.split(" ")[0].split(".");
    const timeParts = parsed.date.split(" ")[1].split(":");
    const date = new Date(
      +dateParts[2],
      +dateParts[1] - 1,
      +dateParts[0],
      +timeParts[0],
      +timeParts[1],
      +timeParts[2]
    );

    return {
      taskId: parsed.taskid.toString().padStart(9, "0"),
      client: parsed.clientid,
      title: parsed.title,
      description: parsed.description,
      conf: parsed.conf,
      userId: parsed.userId,
      owner: parsed.owner,
      date,
      state: parsed.state,
      comments: parsed.comments.map((c) => {
        const [d, t] = c.date.split(" ");
        const [day, month, year] = d.split(".").map(Number);
        const [hours, minutes, seconds] = t.split(":").map(Number);
        return {
          user: c.user,
          comment: c.comment,
          date: new Date(year, month - 1, day, hours, minutes, seconds),
        };
      }),
    };
  } catch (error) {
    if (error?.response?.status === 401 && typeof handleInvalidToken === "function") {
      handleInvalidToken();
      return null;
    }

    console.error("Ошибка при загрузке заявки:", error);
    throw error;
  }
};
