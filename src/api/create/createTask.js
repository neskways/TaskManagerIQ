import { useState, useEffect } from "react";
import { api } from "../axios";
import Cookies from "js-cookie";

export const createTask = (taskData) => {
  useEffect(() => {
    console.log("Новая заявка:", taskData);

    const loadClients = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        // const response = await api.post(`${BASE_URL}/AddNewTask`, taskData);
        // if (response.status === 200) {
        //   setPopupText("Заявка успешно создана!");
        //   setShowPopup(true);
        //   setTimeout(() => setShowPopup(false), 3000);
        //   // Очистка формы или редирект
        // }
      } catch (error) {
        console.error("Ошибка при создании заявки:", error);
        setPopupText("Не удалось создать заявку, попробуйте позже.");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
      }
    };

    loadClients();
  }, []);

  return { clients, showPopup };
};
