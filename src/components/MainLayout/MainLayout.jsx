import s from "./MainLayout.module.scss";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Screamer } from "../Screamer/Screamer";
import { TimerTasks } from "./components/TimerTasks/TimerTasks";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { Snowfall } from "../Snowfall/Snowfall";

export const MainLayout = () => {
  const [showScreamer, setShowScreamer] = useState(false);
  const [screamerType, setScreamerType] = useState("light");
  const [snowEnabled, setSnowEnabled] = useState(false); // новый стейт для снега

  const role = Cookies.get("role");

  useEffect(() => {
    const settings = getFromLocalStorage("secret_settings", {});
    setSnowEnabled(settings.snow_effect || false); // включаем снег если настройка true

    const timers = [];

    if (settings.screamer_soft && String(import.meta.env.VITE_TOKEN_MANAGER) != role) {
      timers.push(
        setInterval(() => {
          setScreamerType("light");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 2000);
        }, 120000)
      );
    }

    if (settings.screamer_hard && String(import.meta.env.VITE_TOKEN_MANAGER) != role) {
      timers.push(
        setInterval(() => {
          setScreamerType("hard");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 300);
        }, 360000)
      );
    }

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className={s.app_layout}>
      <Sidebar />
      <main className={s.main}>
        <TimerTasks />
        <Outlet />
      </main>

      {showScreamer && <Screamer type={screamerType} />}

      {/* Подключаем снег только если включено */}
      <Snowfall enabled={snowEnabled} />
    </div>
  );
};