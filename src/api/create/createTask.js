import { api } from "../axios";

export const createTask = async (payload) => {

  try {
    console.log(payload)
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await api.post(`${BASE_URL}/AddNewTask`, payload, {
      responseType: "text",
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    throw error;
  }
};
