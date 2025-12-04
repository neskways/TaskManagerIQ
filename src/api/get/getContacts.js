import { api } from "../axios";
import Cookies from "js-cookie";

export const getContacts = async (clientId) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const response = await api.post(
      `${BASE_URL}/GetClientContact`,
      { Token: token, ClientId: clientId },
      { responseType: "text" }
    );

    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    return parsed.map((item) => ({
      id: item.n,
      name: item.Name,
      post: item.post,
      mail: item.mail,
      phone: item.phone,
      clientId: item.clientid,
      client: item.client,
    }));
  } catch (error) {
    console.error("Ошибка при получении контактов клиента:", error);
    return [];
  }
};
