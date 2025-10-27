import { api } from "./axios";

export const getSchedule = async (month, year) => {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  try {
    const response = await api.post(
      `${BASE_URL}/GetDutyCalendar`,
      {}, 
      {
        params: { month, year }, 
        responseType: "text",
      }
    );

    const fixed = (response.data || "").replace(/'/g, '"');

    let parsed;
    try {
      parsed = JSON.parse(fixed);
    } catch (e) {
      throw new Error("Invalid JSON from server");
    }

    if (!Array.isArray(parsed)) {
      throw new Error("Unexpected response format: not an array");
    }

    // приводим к нормальному виду; парсим "dd.MM.yyyy" через parts -> new Date(y, m-1, d)
    return parsed.map((item) => {
      const raw = item.Date || "";
      const parts = raw.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid date format in item: " + raw);
      }
      const [dayStr, monthStr, yearStr] = parts;
      const d = parseInt(dayStr, 10);
      const m = parseInt(monthStr, 10);
      const y = parseInt(yearStr, 10);
      const date = new Date(y, m - 1, d); // локальная дата, без сдвига UTC
      return {
        date,
        user: item.User ?? "",
      };
    });
  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
    
    throw error;
  }
};
