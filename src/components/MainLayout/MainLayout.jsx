import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import s from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { TimerTasks } from "./components/TimerTasks/TimerTasks";
import { Screamer } from "../Screamer/Screamer";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const MainLayout = () => {
  const [showScreamer, setShowScreamer] = useState(false);
  const [screamerType, setScreamerType] = useState("light"); // "light" | "hard"
  const role = Cookies.get("role");

  useEffect(() => {
    const settings = getFromLocalStorage("secret_settings", {});

    const timers = [];

    if (settings.screamer_soft && String(import.meta.env.VITE_TOKEN_MANAGER) != role) {
      timers.push(
        setInterval(() => {
          setScreamerType("light");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 300);
        }, 10 * 60 * 950) 
      );
    }
    
    if (settings.screamer_hard && String(import.meta.env.VITE_TOKEN_MANAGER) != role) {
      timers.push(
        setInterval(() => {
          setScreamerType("hard");
          setShowScreamer(true);
          setTimeout(() => setShowScreamer(false), 300);
        }, 30 * 60 * 1000)
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
    </div>
  );
};
