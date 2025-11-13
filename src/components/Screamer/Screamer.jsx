import { useEffect, useState } from "react";
import s from "./Screamer.module.scss";

export const Screamer = ({ type = "light" }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);

    return () => clearTimeout(timeout);
  }, []);

  const imgSrc =
    type === "hard"
      ? "/images/memes/kavabanka.jpg"
      : "/images/memes/kavabankLight.jpg";

  return (
    <div className={`${s.block} ${visible ? s.visible : ""}`}>
      <img src={imgSrc} alt="screamer" />
    </div>
  );
};
