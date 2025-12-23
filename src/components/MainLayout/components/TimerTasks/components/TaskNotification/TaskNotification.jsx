import { useEffect, useState } from "react";
import s from "./TaskNotification.module.scss";

export const TaskNotification = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // запуск анимации после маунта
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });

    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  return (
    <div className={`${s.notification} ${s[type]} ${visible ? s.show : ""}`}>
      {message}
    </div>
  );
};
