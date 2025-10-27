import s from "./ProfileBox.module.scss";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const ProfileBox = ({ isActiveBox, setIsActiveBox }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        
        // Удаляем куки
        Cookies.remove("token");
        Cookies.remove("userId");

        // Закрываем меню
        setIsActiveBox(false);

        // Переходим на страницу логина
        navigate("/login");
    };

    return (
        <>
            {isActiveBox && (
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
                                    onClick={handleLogout}
                                >
                                    Выход
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </>
    );
};
