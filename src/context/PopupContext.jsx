import { createContext, useContext, useState, useCallback } from "react";
import { Popup } from "../UI/Popup/Popup";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    show: false,
    text: "",
    type: null, // true = успех, false = ошибка
    marginNone: false,
  });

  const showPopup = useCallback((text, options = {}) => {
    const { type = null, duration = 3000, marginNone = false } = options;
    setPopup({ show: true, text, type, marginNone });

    if (duration) {
      setTimeout(() => {
        setPopup({ show: false, text: "", type: null, marginNone: false });
      }, duration);
    }
  }, []);

  const hidePopup = useCallback(() => {
    setPopup({ show: false, text: "", type: null, marginNone: false });
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, hidePopup }}>
      {children}
      <Popup
        showPopup={popup.show}
        text={popup.text}
        type={popup.type}
        marginNone={popup.marginNone}
      />
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
