import s from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Surprise } from "../Surprise/Surprise";
import { TimerTasks } from "./components/TimerTasks/TimerTasks";
import { ScreamerBlock } from "../ScreamerBlock/ScreamerBlock";

export const MainLayout = () => {

  return (
    <div className={s.app_layout}>
      <Sidebar />

      <main className={s.main}>
        <TimerTasks />
        <Outlet />
      </main>

      {/* Приколы ниже */}
      <ScreamerBlock />
      {/* <Surprise /> */}
    </div>
  );
};
