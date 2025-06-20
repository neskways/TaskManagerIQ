import s from "./MainLayout.module.scss";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar"; // путь к твоему компоненту

export const MainLayout = () => {
  
  return (
    <div className={s.app_layout}>
      <Sidebar />
      <main className={s.main}>
        <Outlet />
      </main>
    </div>
  );
};