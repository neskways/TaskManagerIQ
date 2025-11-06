import s from "./SidebarSecondary.module.scss";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import { sidebarSecondaryItems } from "./sidebarLinks";
import { saveToLocalStorage } from "../../modules/localStorageUtils";

export const SidebarSecondary = () => {
 
  const role = Cookies.get("role");
  const count = 0;
  
const handleLinkClick = (path) => {
  if (path.startsWith("/tasks/")) {
    saveToLocalStorage("last_tasks_path", path);
  }
};


  // Фильтруем меню по роли
  const filteredItems = sidebarSecondaryItems.filter((item) => {
    if (role === import.meta.env.VITE_TOKEN_EMPLOYEE) return item.availability_to_everyone;
    if (role === import.meta.env.VITE_TOKEN_DUTY) return item.availability_to_dute;
    if (role === import.meta.env.VITE_TOKEN_MANAGER) return item.availability_to_management;
    return false;
  });

  return (
    <>
      <div className={s.block}></div>
      <div className={s.sidebar}>
        <nav className={s.menu}>
          <ul className={s.menu_list}>
            {filteredItems.map((link) => (
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
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
