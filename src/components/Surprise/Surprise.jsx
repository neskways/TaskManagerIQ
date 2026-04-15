import s from "./Surprise.module.scss";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";

export const Surprise = () => {
  const userCode = Cookies.get("userCode");

  const userSounds = {
    "000000063": "/sounds/podarok.mp3",
    "000000071": "/sounds/porno.mp3",
    "000000016": "/sounds/slava.mp3",
    "000000017": "/sounds/ston.mp3",
    "000000003": "/sounds/rebetya.mp3",
    "000000054": "/sounds/ston.mp3",
    "000000089": "/sounds/slava.mp3",
  };

  const soundPath = userSounds[userCode];

  const playUserSound = useCallback(() => {
    if (!soundPath) return;

    const audio = new Audio(soundPath);

    audio.play().catch((err) => {
      console.error("Ошибка при воспроизведении звука:", err);
    });

  }, [soundPath, userCode]);

  if (!soundPath) return null;

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