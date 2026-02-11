import s from "./Surprise.module.scss";
import Cookies from "js-cookie";
import { useCallback } from "react";

export const Surprise = () => {
  const userCode = Cookies.get("userCode");

  // Словарь: userCode → путь к звуку
  const userSounds = {
    "000000002": "/sounds/podarok.mp3",      // Тимур
    "000000063": "/sounds/podarok.mp3",      // Роман
    "000000071": "/sounds/podarok.mp3",    // Айдамир
    "000000016": "/sounds/podarok.mp3",  // Александр
    "000000003": "/sounds/podarok.mp3",   // Виктория
    "000000054": "/sounds/podarok.mp3",     // Кирилл
    "000000007": "/sounds/podarok.mp3",   // Роман 1С
  };

  const soundPath = userSounds[userCode];

  // Если для пользователя нет подарка, не рендерим ничего
  if (!soundPath) return null;

  const playUserSound = useCallback(() => {
    const audio = new Audio(soundPath);
    audio.play().catch((err) => {
      console.error("Ошибка при воспроизведении звука:", err);
    });
  }, [soundPath]);

  return (
    <img
      className={s.podarok}
      src="/images/podarok.png"
      alt=""
      title="ЖМИ! ЖМИ!"
      onClick={playUserSound}
      style={{ cursor: "pointer" }}
    />
  );
};
