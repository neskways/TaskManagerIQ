import { useState, useEffect } from "react";
import axios from "axios";

export const useClients = (url) => {
  const [clients, setClients] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    axios.post(url, {}, { responseType: "text" })
      .then((response) => {
        try {
          const fixed = response.data.replace(/'/g, '"');
          const parsed = JSON.parse(fixed);
          setClients(parsed);
          console.log(parsed + "  " + fixed);
        } catch (error) {
          console.error("Ошибка при парсинге JSON:", error);
        }
      })
      .catch(() => {
        setShowPopup(true);
        const timer = setTimeout(() => setShowPopup(false), 3000);
        return () => clearTimeout(timer);
      });
  }, [url]);

  return { clients, showPopup };
};
