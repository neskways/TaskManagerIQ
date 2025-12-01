import s from "./ContentWrapper.module.scss";
import { useState, useEffect } from "react";

export const ContentWrapper = ({ children, reletive }) => {
  
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10); 
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
