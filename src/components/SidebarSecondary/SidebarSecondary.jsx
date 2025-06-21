import { NavLink } from "react-router-dom";
import { sidebarSecondaryItems } from "../../modules/sidebarLinks";
import { saveToLocalStorage } from "../../modules/localStorageUtils";
import s from "./SidebarSecondary.module.scss";

export const SidebarSecondary = () => {
  const count = 0;

  const handleLinkClick = (path) => {
    saveToLocalStorage("last_secondary_sidebar_path", path);
  };

  return (
    <>
      <div className={s.block}></div>
      <div className={s.sidebar}>
        <nav className={s.menu}>
          <ul className={s.menu_list}>
            {sidebarSecondaryItems.map((link) => (
              <li className={s.menu_item} key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `${s.menu_link} ${isActive ? s.active : ""}`
                  }
                  end={link.exact}
                  onClick={() => handleLinkClick(link.to)}
                >
                  <span>{link.label}</span>
                  <span className={s.count}>{count}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
