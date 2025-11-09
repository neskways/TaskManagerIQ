import { useState, useEffect } from "react";
import { getUpdateMap } from "../../../../../api/get/getUpdateMap";
import { loadCache, saveCache } from "../../../../../modules/cookieCache";

export const useUpdateSchedule = (cacheKey = "update-schedule") => {
  const [schedule, setSchedule] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processData = (data) => {
    if (!data || data.length === 0) return [];

    const sampleDate = data[0].date;
    const days = new Date(sampleDate.getFullYear(), sampleDate.getMonth() + 1, 0).getDate();
    setDaysInMonth(days);

    const clientsMap = {};
    data.forEach((item) => {
      if (!item.date || !item.client) return;
      const dayIndex = item.date.getDate() - 1;

      if (!clientsMap[item.client]) {
        clientsMap[item.client] = Array(days)
          .fill(null)
          .map(() => []);
      }

      clientsMap[item.client][dayIndex].push(item);
    });

    return Object.entries(clientsMap).map(([name, updates]) => ({ name, updates }));
  };

  const loadSchedule = async (force = false) => {
    if (!force) {
      const cached = loadCache(cacheKey);
      if (cached) {
        const restored = cached.map((client) => ({
          ...client,
          updates: client.updates.map((arr) =>
            arr.map((u) => ({ ...u, date: new Date(u.date) }))
          ),
        }));
        setSchedule(restored);
        setDaysInMonth(restored[0]?.updates.length || 0);
        setError(null); 
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getUpdateMap();
      const processed = processData(data);
      if (!processed || processed.length === 0) {
        throw new Error("Пустое расписание");
      }

      setSchedule(processed);
      saveCache(cacheKey, processed);
    } catch (err) {
      console.error("Ошибка загрузки расписания:", err);
      setError(err); 
      setSchedule([]);
      setDaysInMonth(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  return { schedule, daysInMonth, loading, loadSchedule, error }; 
};
