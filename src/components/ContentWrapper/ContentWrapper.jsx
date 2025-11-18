import { useState, useEffect } from "react";
import s from "./ContentWrapper.module.scss";

export const ContentWrapper = ({ children, reletive }) => {
  
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10); // небольшая задержка
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`${s.wrapper}`}>
      <div
        className={`${s.inner} ${visible ? s.show : ""} ${reletive ? s.reletive : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
