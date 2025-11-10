import { createContext, useContext, useState, useCallback } from "react";
import { PopupList } from "../UI/Popup/PopupList";
import { useLocation } from "react-router-dom";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);
  const location = useLocation();

  // Авто-центрирование только на /login
  const center = location.pathname === "/login";

  const showPopup = useCallback((text, options = {}) => {
    const { type = "info", duration = 3000 } = options;
    const id = Date.now();

    setPopups((prev) => [...prev, { id, text, type, duration, center }].slice(-3));

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, duration);
  }, [center]);

  const removePopup = useCallback((id) => {
    setPopups((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup }}>
      {children}
      <PopupList popups={popups} removePopup={removePopup} />
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
