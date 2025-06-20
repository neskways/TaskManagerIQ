import s from "./Sidebar.module.scss";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HeaderSidebar } from "../HeaderSidebar/HeaderSidebar";
import { FooterSidebar } from "../FooterSidebar/FooterSidebar";
import { sidebarItems } from "../../modules/sidebarLinks"; // импортируем конфиг

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isActiveBox, setIsActiveBox] = useState(false);

  return (
    <>
      <div className={s.block}></div>
      <div className={s.sidebar}>
      <HeaderSidebar />
      <nav className={s.menu}>
        <ul className={s.menu_list}>
          {sidebarItems.map(({ label, path, isActive, Icon }) => (
            <li className={s.menu_item} key={label}>
              <NavLink
                to={path}
                className={`${s.menu_link} ${isActive(currentPath) ? s.active : ""}`}
                onClick={() => setIsActiveBox(false)}
              >
                <Icon />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <FooterSidebar isActiveBox={isActiveBox} setIsActiveBox={setIsActiveBox} />
    </div>
    </>
  );
};
