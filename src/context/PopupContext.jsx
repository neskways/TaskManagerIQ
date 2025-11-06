import { createContext, useContext, useState, useCallback } from "react";
import { PopupList } from "../UI/Popup/PopupList";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popups, setPopups] = useState([]);

  const showPopup = useCallback((text, options = {}) => {
    const { type = "info", duration = 3000 } = options;

    const id = Date.now();

    setPopups((prev) => {
      const next = [...prev, { id, text, type, duration }];
      return next.slice(-3); 
    });

    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, duration);
  }, []);

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
