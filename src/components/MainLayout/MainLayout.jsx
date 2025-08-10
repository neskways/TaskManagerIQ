import s from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { TimerTasks } from "./components/TimerTasks/TimerTasks"; // через alias @

export const MainLayout = () => {
  return (
    <div className={s.app_layout}>
      <Sidebar />
      <main className={s.main}>
        <TimerTasks />
        <Outlet />
      </main>
    </div>
  );
};
