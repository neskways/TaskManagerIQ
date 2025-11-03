import s from "./LoginPage.module.scss";
import Cookies from "js-cookie";
import { useState } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { loginUser } from "../../api/loginUser";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../context/PopupContext";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { showPopup } = usePopup(); // 🔹 хук глобального попапа
  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";

  const savedPath = getFromLocalStorage("last_tasks_path", "/tasks/my_assigned");

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorIn, setIsErrorIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser(login, password);

      showPopup("Вы успешно вошли в систему!", { type: true });
      navigate(savedPath, { replace: true });

    } catch (error) {
      console.error(error.message);

      setIsErrorIn(true);

      showPopup("Неправильный логин или пароль!", { type: false, marginNone: true });
      setTimeout(() => {
        setIsErrorIn(false);
      }, 3000);
    }
  };

  return (
    <div className={s.inner}>
      <div className={s.wrapper}>
        <h2 className={s.title}>Вход в IQProg Support</h2>
        <form className={s.form} onSubmit={handleLogin}>
          <div className={s.img_wrap}>
            <img
              className={s.img}
              src={theme === "light" ? lightLogo : darkLogo}
              alt="IQProg"
              onDoubleClick={() => window.open("./images/mem.jpg", "_blank")}
            />
          </div>

          <Input
            text="Логин"
            isErrorIn={isErrorIn}
            type="text"
            setUserData={setLogin}
          />
          <Input
            text="Пароль"
            isErrorIn={isErrorIn}
            type="password"
            setUserData={setPassword}
          />

          <div className={s.button_wrap}>
            <Button name="Войти" type="submit" />
          </div>
        </form>
      </div>

      <div className={s.pashalka}>
        <a
          href="https://pornhub.com"
          className={s.pashalka}
          target="_blank"
          rel="noreferrer"
        ></a>
      </div>
    </div>
  );
};
