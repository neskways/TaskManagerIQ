import { useState, useEffect } from "react";
import { api } from "./axios";

export const getClientConfigurations = (clientID) => {
  const [configurations, setConfigurations] = useState([]);

  useEffect(() => {
    const token = Cookies.get("token");

    const loadConfigurations = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        // передаём токен в теле запроса
        const response = await api.post(
          `${BASE_URL}/ClientConfigurationsGetList`,
          { Token: token, ClientId: clientID },
          { responseType: "text" }
        );

        const fixed = (response.data || "").replace(/'/g, '"');
        const parsed = JSON.parse(fixed);

        setConfigurations(parsed || []);
      } catch (error) {
        console.error(
          `Ошибка при загрузке конфигураций клиента ${client}: ${error}`
        );
      }
    };

    loadConfigurations();
  }, []);

  return { configurations };
};
