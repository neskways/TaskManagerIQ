import s from "./HeaderSidebar.module.scss";
import React from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export const HeaderSidebar = React.memo(() => {

  const { theme } = useTheme();
  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";

  return (
    <div className={s.header}>
      <NavLink to="/ticket">
        <img className={s.logo} src={theme === "light" ? lightLogo : darkLogo} alt="" />
      </NavLink>
    </div>
  );
});


