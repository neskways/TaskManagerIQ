import s from "./MainLayout.module.scss";
import Cookies from "js-cookie";
import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { Screamer } from "../Screamer/Screamer";
import { TimerTasks } from "./components/TimerTasks/TimerTasks";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const MainLayout = () => {
  const [showScreamer, setShowScreamer] = useState(false);
  const [screamerType, setScreamerType] = useState("light");

  const role = Cookies.get("role");
  const userCode = Cookies.get("userCode")

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
