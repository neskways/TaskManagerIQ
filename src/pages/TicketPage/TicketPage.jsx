import s from "./TicketPage.module.scss";
import { SidebarSecondary } from "../../components/SidebarSecondary/SidebarSecondary";
import { Outlet } from 'react-router-dom';

export const TicketPage = () => {
  return (
      <div className={s.wrapper}>
        <SidebarSecondary />
        <div className={s.ticket_inner}>
          <Outlet />
        </div>
    </div>
  );
}
