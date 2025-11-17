import { useState, useEffect } from "react";
import { getUpdateMap } from "../../../../../api/get/getUpdateMap";
import { loadCache, saveCache } from "../../../../../modules/cookieCache";

export const useUpdateSchedule = (cacheKey = "update-schedule") => {
  const [schedule, setSchedule] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedOnce, setLoadedOnce] = useState(false);

  const processData = (data) => {
    if (!data || data.length === 0) return [];

    const sampleDate = data[0].date;
    const days = new Date(
      sampleDate.getFullYear(),
      sampleDate.getMonth() + 1,
      0
    ).getDate();

    setDaysInMonth(days);

    const clientsMap = {};

    data.forEach((item) => {
      if (!item.date || !item.client) return;

      const dayIndex = item.date.getDate() - 1;

      if (!clientsMap[item.client]) {
        clientsMap[item.client] = Array.from({ length: days }, () => []);
      }

      clientsMap[item.client][dayIndex].push(item);
    });

    return Object.entries(clientsMap).map(([name, updates]) => ({
      name,
      updates,
    }));
  };

  const loadSchedule = async (force = false) => {
    setLoading(true);
    setError(null);

    // 1️⃣ Загружаем из кэша, если не force
    if (!force) {
      const cached = loadCache(cacheKey);
      if (cached) {
        const restored = cached.map((client) => ({
          name: client.name,
          updates: client.updates.map((arr) =>
            arr.map((u) => ({ ...u, date: new Date(u.date) }))
          ),
        }));

        setSchedule(restored);
        setDaysInMonth(restored[0]?.updates.length || 0);
        setLoadedOnce(true);

        setLoading(false);
        return restored; // ⬅ ВАЖНО: выходим, не делаем запрос
      }
    }

    // 2️⃣ Запрос к серверу
    try {
      const data = await getUpdateMap();
      if (data === null) return null;

      const processed = processData(data);

      // Пустой массив — НЕ ошибка
      setSchedule(processed);
      saveCache(cacheKey, processed);

      setLoadedOnce(true);
      return processed;
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError(err);

      // Оставляем старые данные
      setLoadedOnce(true);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return {
    schedule,
    daysInMonth,
    loading,
    loadSchedule,
    error,
    loadedOnce,
  };
};
