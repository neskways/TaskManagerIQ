import { useEffect } from "react";

export const Snowfall = ({ enabled }) => {
  useEffect(() => {
    if (!enabled) return; // если снег выключен — ничего не делаем

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/Alaev-Co/snowflakes/dist/Snow.min.js";
    script.async = true;

    script.onload = () => {
      // eslint-disable-next-line no-undef
      new Snow({
        iconSize: 13,
        showSnowBalls: false,
        countSnowflake: 50
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [enabled]);

  return null; // ничего в DOM не рендерим
};
