import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Screamer } from "./Screamer/Screamer";
import { getFromLocalStorage } from "../../modules/localStorageUtils";


export const ScreamerBlock = () => {
  const [showScreamer, setShowScreamer] = useState(false);
  const [screamerType, setScreamerType] = useState("light");

  const role = Cookies.get("role");

  useEffect(() => {
    const settings = getFromLocalStorage("secret_settings", {});
    const timers = [];

    if (settings.screamer_soft && String(import.meta.env.VITE_TOKEN_MANAGER) !== role) {
      timers.push(
        setInterval(() => {
          setScreamerType("light");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 2000);
        }, 120000)
      );
    }

    if (settings.screamer_hard && String(import.meta.env.VITE_TOKEN_MANAGER) !== role) {
      timers.push(
        setInterval(() => {
          setScreamerType("hard");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 300);
        }, 360000)
      );
    }

    return () => timers.forEach(clearInterval);
  }, [role]);

  return (
    <div>
      {showScreamer && <Screamer type={screamerType} />}
    </div>
  );
};

