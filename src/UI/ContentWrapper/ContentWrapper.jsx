import { useState, useEffect } from "react";
import styles from "./ContentWrapper.module.scss";

export const ContentWrapper = ({ children }) => {
  
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10); // небольшая задержка
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        className={`${styles.inner} ${visible ? styles.show : ""}`}
      >
        {children}
      </div>
    </div>
  );
};
