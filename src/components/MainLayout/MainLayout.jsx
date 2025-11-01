import { useState, useEffect } from "react";
import s from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { TimerTasks } from "./components/TimerTasks/TimerTasks";
import { Screamer } from "../Screamer/Screamer";

export const MainLayout = () => {

  // const [showScreamer, setShowScreamer] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setShowScreamer(true);
  //     setTimeout(() => setShowScreamer(false), 100);
  //   }, 60000); 

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className={s.app_layout}>
      <Sidebar />
      <main className={s.main}>
        <TimerTasks />
        <Outlet />
      </main>

      {/* {showScreamer && <Screamer />} */}
    </div>
  );
};
