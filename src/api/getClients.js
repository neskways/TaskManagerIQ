import { useState, useEffect } from "react";
import { api } from "./axios";

export const getClients = () => {

  const [clients, setClients] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const loadClients = async () => {
      try {
        const response = await api.post(`${BASE_URL}/ClientGetList`, {}, { responseType: "text" });

        const fixed = (response.data || "").replace(/'/g, '"');
        const parsed = JSON.parse(fixed);

        setClients(parsed);
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
