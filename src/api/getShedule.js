import { api } from "./axios";

export const getSchedule = async (month, year) => {
  try {
    const response = await api.post(
      "/iqit/hs/iqit/GetDutyCalendar",
      { month, year }, // тело запроса
      { responseType: "text" }
    );

    // сервер присылает с одинарными кавычками → фиксируем
    const fixed = response.data.replace(/'/g, '"');
    const parsed = JSON.parse(fixed);

    // приводим к нормальному виду
    return parsed.map((item) => ({
      date: new Date(item.Date.split(".").reverse().join("-")), // "01.09.2025" → Date
      user: item.User,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке расписания:", error);
    return [];
  }
};
