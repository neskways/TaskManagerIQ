import s from "./FooterSidebar.module.scss";
import React from "react";
import { NavLink } from "react-router-dom";
import { AddTicket } from "../../UI/AddTicket/Add";
import { ProfileBox } from "../Profilebox/Profilebox";

export const FooterSidebar = React.memo(({ isActiveBox, setIsActiveBox }) => {

  return (
    <footer className={s.footer}>
      <button className={`${s.footer_block} ${s.profile} ${isActiveBox === true && s.active}`}
        onClick={() => setIsActiveBox(!isActiveBox)}>
        <img src="/images/default.png" alt="" />
      </button>
      <NavLink className={`${s.footer_block} ${s.create}`} to="/create" title="Создать заявку" onClick={() => setIsActiveBox(false)}>
        <AddTicket />
      </NavLink>
      <ProfileBox isActiveBox={isActiveBox} setIsActiveBox={setIsActiveBox} />
    </footer>
  );
});

