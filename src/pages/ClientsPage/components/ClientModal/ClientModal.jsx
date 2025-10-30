import s from "./ClientModal.module.scss";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../UI/CloseIcon/CloseIcon";

export const ClientModal = ({ clientData, onClose }) => {
  const [show, setShow] = useState(false);

  // Сбрасываем анимацию при закрытии
  useEffect(() => {
    if (!clientData) {
      setShow(false);
    }
  }, [clientData]);

  // Запускаем анимацию при открытии
  useEffect(() => {
    if (clientData) {

      const timer = setTimeout(() => setShow(true), 10);
      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [clientData]);

  if (!clientData) return null;

  return (
    <div
      className={`${s.modalOverlay} ${show ? s.show : ""}`}
      onClick={onClose}
    >
      <div
        className={`${s.modalContent} ${show ? s.show : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={s.title}>Данные клиента</h2>
        <p><strong>Имя:</strong> {clientData.name}</p>
        <p><strong>Статус:</strong> {clientData.status}</p>
        <p><strong>Телефон:</strong> {clientData.phone}</p>
        <button className={s.close_btn} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
