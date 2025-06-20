import React, { useEffect } from "react";
import s from "./ClientModal.module.scss";

export const ClientModal = ({ clientData, onClose }) => {
  useEffect(() => {
    // if (clientData) {
    //   document.body.style.overflow = "hidden"; 
    //   document.body.style.paddingRight = 15 + "px"; 
    // }

    // return () => {
    //   document.body.style.overflow = ""; 
    //   document.body.style.paddingRight = ""; 
    // };
  }, [clientData]);

  if (!clientData) return null;

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>Данные клиента</h2>
        <p><strong>Имя:</strong> {clientData.name}</p>
        <p><strong>Статус:</strong> {clientData.status}</p>
        <p><strong>Телефон:</strong> {clientData.phone}</p>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};
