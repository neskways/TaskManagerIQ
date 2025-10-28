import { api } from "./axios";
import Cookies from "js-cookie";

export const getSchedule = async (month, year) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const token = Cookies.get("token");

    console.log("Отправляем запрос:", BASE_URL, { Token: token, Month: month, Year: year });

    const response = await api.post(
      `${BASE_URL}/GetDutyCalendar`,
      {
        token: token, 
        month: month,
        year: year,
      },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    if (!Array.isArray(parsed)) {
      throw new Error("Unexpected response format: not an array");
    }

    return parsed.map((item) => {
      const [day, monthStr, yearStr] = (item.Date || "").split(".");
      const date = new Date(+yearStr, +monthStr - 1, +day);
      return { date, user: item.User ?? "" };
    });

  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
    throw error;
  }
};
