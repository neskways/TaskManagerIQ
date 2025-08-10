import { NavLink } from "react-router-dom";
import s from "./ProfileBox.module.scss";

export const ProfileBox = ({ isActiveBox, setIsActiveBox }) => {

    return (
        <>
            {
                isActiveBox === true &&

                <div className={s.wrapper}>
                    <nav className={s.nav}>
                        <ul className={s.list}>
                            <li className={s.list_item}>
                                <NavLink
                                    to="/profile"
                                    className={s.menu_link}
                                    onClick={() => setIsActiveBox(false)}
                                >
                                    Профиль
                                </NavLink>
                            </li>
                            <li className={s.list_item}>
                                <NavLink
                                    to="/parameters"
                                    className={s.menu_link}
                                    onClick={() => setIsActiveBox(false)}
                                >
                                    Параметры
                                </NavLink>
                            </li>
                            <li className={s.list_item}>
                                <NavLink
                                    to="/login"
                                    className={`${s.menu_link} ${s.exit_link}`}
                                    onClick={() => setIsActiveBox(false)}
                                >
                                    Выход
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            }
        </>
    )
}
