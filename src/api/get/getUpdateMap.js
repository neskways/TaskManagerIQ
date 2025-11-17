// api.js
import { api } from "../axios";
import Cookies from "js-cookie";

export const getUpdateMap = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const response = await api.post(
      `${BASE_URL}/GetUpdateMap`,
      { token },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    return parsed.map(item => {
      const [day, monthStr, yearStr] = (item.Date || "").split(".");
      const date = new Date(+yearStr, +monthStr - 1, +day);
      return {
        date,
        client: item.Client,
        config: item.Config,
        employee: item.Employee,
        done: item.Done === "Да",
        dateOf: item.DateOf,
      };
    });
  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
    return null;
  }
};
