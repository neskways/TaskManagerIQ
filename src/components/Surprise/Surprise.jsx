import s from "./Surprise.module.scss";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";

export const Surprise = () => {
  const userCode = Cookies.get("userCode");
  const [show, setShow] = useState(false)
  // Словарь: userCode → путь к звуку
  const userSounds = {
    "000000063": "/sounds/podarok.mp3", // Роман
    "000000071": "/sounds/porno.mp3",   // Айдамир
    "000000016": "/sounds/slava.mp3",   // Александр
    "000000017": "/sounds/ston.mp3",   // Александр
    "000000003": "/sounds/rebetya.mp3", // Виктория
    "000000054": "/sounds/ston.mp3",    // Кирилл
    "000000007": "/sounds/porno.mp3",   // Роман 1С
  };

  const soundPath = userSounds[userCode];

  // Если для пользователя нет подарка, не рендерим ничего
  if (!soundPath) return null;

  const playUserSound = useCallback(() => {
    const audio = new Audio(soundPath);
    audio.play().catch((err) => {
      console.error("Ошибка при воспроизведении звука:", err);
    });

    if(userCode === "000000063") {
      setShow(true);
    }

  }, [soundPath]);

  return (
    <>
      <img className={`${s.podarok2} ${show ? s.show : ""}`} src="/images/memes/makaka.gif" alt="" />
      <img
        className={s.podarok}
        src="/images/podarok.png"
        alt=""
        title="ЖМИ! ЖМИ!"
        onClick={playUserSound}
        style={{ cursor: "pointer" }}
      />
    </>
  );
};
