import s from "./Sidebar.module.scss";
import Cookies from "js-cookie";
import { useState } from "react";
import { sidebarItems } from "./sidebarLinks";
import { useTheme } from "../../context/ThemeContext";
import { NavLink, useLocation } from "react-router-dom";
import { saveToLocalStorage } from "../../modules/localStorageUtils";
import { HeaderSidebar } from "./components/HeaderSidebar/HeaderSidebar";
import { FooterSidebar } from "./components/FooterSidebar/FooterSidebar";

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const role = Cookies.get("role");
  const userCode = Cookies.get("userCode");
  const [isActiveBox, setIsActiveBox] = useState(false);
  const { theme } = useTheme();

  const handleLinkClick = (path) => {
    saveToLocalStorage("last_link_path", path);
    setIsActiveBox(false);
  };

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
                  onClick={() => handleLinkClick(path)}
                  className={`${s.menu_link} ${
                    isActive(currentPath) ? s.active : ""
                  }`}
                >
                  <Icon isActive={isActive(currentPath)} theme={theme} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {(String(import.meta.env.VITE_TOKEN_MANAGER) !== role && userCode !== "000000002" && userCode !== "000000003") && (
          <img className={s.img_gif} src="/images/gif.gif" />
        )}
        {/* {(userCode === "000000054") && (
          <img className={s.img_gif} src="/images/gif2.gif" />
        )}
        {(userCode === "000000007") && (
          <img className={s.img_gif} src="/images/gif2.gif" />
        )} */}
        {(userCode === "000000003") && (
          <img className={s.img_gif} src="/images/gif3.gif" />
        )}

        <FooterSidebar
          isActiveBox={isActiveBox}
          setIsActiveBox={setIsActiveBox}
        />
      </div>
    </>
  );
};
