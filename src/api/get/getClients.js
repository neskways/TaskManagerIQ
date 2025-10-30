import { api } from "../axios";
import Cookies from "js-cookie";

export const getClients = async () => {
  try {
    const token = Cookies.get("token");
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const response = await api.post(
      `${BASE_URL}/ClientGetList`,
      { Token: token },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    return parsed || [];
  } catch (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    throw error;
  }
};
