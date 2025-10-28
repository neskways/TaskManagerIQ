import { useState, useEffect } from "react";
import { api } from "./axios";
import Cookies from "js-cookie";

export const getUsers = () => {
  
  const [clients, setClients] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = Cookies.get("token"); // достаём токен из куки

    if (!token) {
      console.error("Токен отсутствует в cookies");
      setShowPopup(true);
      return;
    }

    const loadClients = async () => {
      try {
        // передаём токен в теле запроса
        const response = await api.post(
          `${BASE_URL}/ClientGetList`,
          { token: token },
          { responseType: "text" }
        );

        const fixed = (response.data || "").replace(/'/g, '"');
        const parsed = JSON.parse(fixed);

        setClients(parsed || []);
      } catch (error) {
        console.error("Ошибка при загрузке клиентов:", error);

        setShowPopup(true);
        const timer = setTimeout(() => setShowPopup(false), 3000);
        return () => clearTimeout(timer);
      }
    };

    loadClients();
  }, []);

  return { clients, showPopup };
};
