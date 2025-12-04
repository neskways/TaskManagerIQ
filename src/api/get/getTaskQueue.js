import { api } from "../axios";
import Cookies from "js-cookie";


export const getTaskQueue = async (state) => {

  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");
    const userCode = Cookies.get("userCode");
    const role = Cookies.get("role");

    const response = await api.post(
      `${BASE_URL}/GetTaskQueue`,
      { Token: token, userid: userCode, state },
      { responseType: "text" }
    );
    
    const jsonString = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) {
      throw new Error("Неверный формат ответа от GetTaskQueue");
    }

    const normalized = parsed.map((item) => {
      const timeSec = Number(item.time) || 0;
      const startedAt = item.startedAt || item.startTime || item.StartedAt || null;
      let displaySec = timeSec;

      if (startedAt) {
        const startedTs = new Date(startedAt).getTime();
        if (!Number.isNaN(startedTs)) {
          const deltaMs = Date.now() - startedTs;
          if (deltaMs > 0) {
            displaySec = Math.floor(timeSec + deltaMs / 1000);
          }
        }
      }

      return {
        id: parseInt(item.id ?? item.TaskID ?? item.ID ?? item.idTask ?? "", 10),
        title: item.title ?? item.Title ?? item.Name ?? "",
        state: item.state ?? item.State ?? item.status ?? "",
        executor: item.userid ?? item.UserId ?? item.user ?? "",
        timeSec,
        displaySec,
        client: item.client,
        priority: Number(item.priority) || 0,
        deadline: item.deadline ?? null,
        startedAt: startedAt ? new Date(startedAt).toISOString() : null,
      };
    });
    // if(role != import.meta.env.VITE_TOKEN_MANAGER) {
    //   const sorted = normalized.sort((a, b) => {
    //     if (b.priority !== a.priority) return b.priority - a.priority;
    //     return b.displaySec - a.displaySec;
    //   });
      
    //   // берем топ-10
    //   return sorted.slice(0, 10);
    // }
    //Иначе возвращаем все
    return normalized;
  } catch (err) {
    console.error("Ошибка при загрузке GetTaskQueue:", err);
    throw err;
  }
};
