// ModalWindow.jsx
import s from "./ModalWindow.module.scss";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../../UI/CloseIcon/CloseIcon";

export const ModalWindow = ({ updatesArray, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (updatesArray) {
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [updatesArray]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // анимация закрытия
  };

  if (!updatesArray) return null;

  return (
    <div
      className={`${s.modalOverlay} ${show ? s.show : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${s.modalContent} ${show ? s.show : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={s.title}>Обновления</h2>
        {updatesArray.map((u, idx) => (
          <div key={idx} className={s.updateItem}>
            <div className={s.text}><div className={s.text_item}>Клиент:</div> <div className={s.text_item2}>{u.client}</div></div>
            <div className={s.text}><div className={s.text_item}>Конфигурация:</div> <div className={s.text_item2}>{u.config}</div></div>
            <div className={s.text}><div className={s.text_item}>Сотрудник:</div> <div className={s.text_item2}>{u.employee}</div></div>
            <div className={s.text}><div className={s.text_item}>Дата:</div> <div className={s.text_item2}>{u.date.toLocaleDateString("ru-RU")}</div></div>
            <div className={s.text}><div className={s.text_item}>Выполнено:</div> <div className={s.text_item2}>{u.done ? "Да" : "Нет"}</div></div>
          </div>
        ))}
        <button className={s.close_btn} onClick={handleClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
