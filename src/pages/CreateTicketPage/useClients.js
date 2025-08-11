import { useState, useEffect } from "react";
import axios from "axios";

export const useClients = (url) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    axios.post(url, {}, { responseType: "text" })
      .then((response) => {
        try {
          // Заменяем одинарные кавычки на двойные
          const fixed = response.data.replace(/'/g, '"');
          const parsed = JSON.parse(fixed);

          // Маппим в удобный формат
          const mapped = parsed.map(c => ({
            name: c.Name,    // для поиска
            code: c.Code,    // для будущих запросов
            original: c      // вся остальная информация
          }));

          setClients(mapped);
        } catch (error) {
          console.error("Ошибка при парсинге JSON:", error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  return { clients, loading };
};
