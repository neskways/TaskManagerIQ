import { api } from "../axios";
import Cookies from "js-cookie";

export const getEmployees = async () => {
  try {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token");

    const response = await api.post(
      `${BASE_URL}/GetEmployee`,
      { token },
      { responseType: "text" }
    );

    // Приводим данные к корректному JSON
    const fixed = (response.data || "").replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    // Исключаем сотрудников + сортировка по фамилии от А до Я
    const result = Array.isArray(parsed)
      ? parsed
          .filter(
            (employee) =>
              employee.Name !== "Ященко Евгений" &&
              employee.Name !== "Хабохов Артур"
          )
          .sort((a, b) =>
            a.Name.localeCompare(b.Name, "ru", { sensitivity: "base" })
          )
      : [];

    return result;
  } catch (error) {
    console.error("Ошибка при загрузке сотрудников:", error);
    return [];
  }
};