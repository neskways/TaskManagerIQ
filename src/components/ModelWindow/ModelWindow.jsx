import s from "./ModelWindow.module.scss";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../UI/CloseIcon/CloseIcon";

export const ModelWindow = ({ isOpen, onClose, children, isPadding = true }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShow(true), 10);

      document.body.style.overflow = "hidden";

      return () => clearTimeout(timer);
    } else {
      setShow(false);
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`${s.modalOverlay} ${show ? s.show : ""}`}
      onClick={onClose}
    >
      <div
        className={`${s.modalContent} ${show ? s.show : ""} ${isPadding ? s.paddingModalContent : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}

        <button className={s.close_btn} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
