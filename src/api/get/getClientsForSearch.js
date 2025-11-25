import { api } from "../axios";
import Cookies from "js-cookie";

export const getClientsForSearch = async () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = Cookies.get("token");

  try {
    const response = await api.post(
      `${BASE_URL}/ClientGetList`,
      { Token: token },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);
    
    const clients = Array.isArray(parsed)
      ? parsed.map((c) => ({
          name: c.Name,
          code: c.Code,
          priority: c.Priority,
          department: c.department, //Подразделение
          card: c.card, //Карта розницы
          cardbalance: c.cardbalance, //Остаток карты
          activities: c.Activities || [],
        }))
      : [];

    return clients;
  } catch (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    return [];
  }
};
