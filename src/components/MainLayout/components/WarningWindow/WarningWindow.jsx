import { useEffect } from "react";
import s from "./WarningWindow.module.scss";
import { usePopup } from "../../../../context/PopupContext";

export const WarningWindow = ({ onClose }) => {
  const { showPopup } = usePopup();

  useEffect(() => {
    const audio = new Audio("/sounds/hornet_edino.mp3");
    audio.play().catch(() => {
    });
  }, []);

  const closeWarning = () => {
    onClose();
    showPopup("Молодец, сосунок.", "info");
  };

  return (
    <div className={s.modalOverlay}>
      <div className={s.modalWindow} onClick={(e) => e.stopPropagation()}>
        <div className={s.idleWarning}>
          Таймер выполнения задач не включен более <b>10 минут</b>!
        </div>
        <div className={s.idleWarning}>Включи таймер и выполняй задачи!</div>
        <div className={s.idleWarningText}>
          Если у тебя нет задач, которые ты можешь выполнять сейчас — подойди к руководителю или дежурному
        </div>
        <button className={s.btn} onClick={closeWarning}>
          Извините пожалуйста, сейчас запущу
        </button>
      </div>
    </div>
  );
};
