import s from "./SidebarSecondary.module.scss";
import { NavLink } from "react-router-dom";
import { sidebarSecondaryItems } from "../../modules/sidebarLinks";

export const SidebarSecondary = () => {
  const count = 0;

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
