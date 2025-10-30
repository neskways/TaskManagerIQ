import { api } from "../axios";

export const createTask = async (payload) => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await api.post(`${BASE_URL}/AddNewTask`, payload);
    if (response.status === 200) {
      return response.data; // просто возвращаем ответ сервера
    } else {
      throw new Error("Ошибка при создании заявки");
    }
  } catch (error) {
    console.error("Ошибка при создании заявки:", error);
    throw error;
  }
};
