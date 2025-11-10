import s from "./FooterSidebar.module.scss";
import React from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { AddTicket } from "../../../../UI/AddTicket/Add";
import { ProfileBox } from "../ProfileBox/Profilebox";

export const FooterSidebar = React.memo(({ isActiveBox, setIsActiveBox }) => {

  const role = Cookies.get("role");
  const userCode = Cookies.get("userCode");

  return (
    <footer className={`${s.footer} ${role === import.meta.env.VITE_TOKEN_EMPLOYEE ? s.not_duty : ""}`}>
      <button
        className={`${s.footer_block} ${s.profile} ${
          isActiveBox === true && s.active
        }`}
        onClick={() => setIsActiveBox(!isActiveBox)}
      >
        <img className={s.img} src={`/images/avatars/${userCode}.jpg`} alt="" />
      </button>
      {role !== import.meta.env.VITE_TOKEN_EMPLOYEE && 
      <div className={s.link_wrap}>
        <NavLink
          className={`${s.footer_block} ${s.create}`}
          to="/create"
          title="Создать заявку"
          onClick={() => setIsActiveBox(false)}
        >
          <AddTicket />
        </NavLink>
      </div>
      }
      <ProfileBox isActiveBox={isActiveBox} setIsActiveBox={setIsActiveBox} />
    </footer>
  );
});
