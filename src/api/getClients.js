import { api } from "./axios";

export const getClients = async () => {
  try {
    const response = await api.post("/iqit/hs/iqit/ClientGetList", {}, { responseType: "text" });

    // фикс одинарных кавычек
    const fixed = response.data.replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    return parsed;
  } catch (error) {
    console.error("Ошибка при загрузке клиентов:", error);
    throw error;
  }
};
