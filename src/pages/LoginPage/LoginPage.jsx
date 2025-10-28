import s from "./LoginPage.module.scss";
import Cookies from "js-cookie";
import { useState } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Popup } from "../../UI/Popup/Popup";
import { loginUser } from "../../api/loginUser";

export const LoginPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorIn, setIsErrorIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      await loginUser(login, password);  
      window.location.href = "/";

    } catch (error) {
      console.error(error.message);
      setIsErrorIn(true);
      setShowPopup(true);

      const timer = setTimeout(() => {
        setShowPopup(false);
        setIsErrorIn(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  };

  return (
    <>
      <div className={s.inner}>
        <div className={s.wrapper}>
          <h2 className={s.title}>Вход в IQProg Support</h2>
          <form className={s.form} onSubmit={handleLogin}>
            <div className={s.img_wrap}>
              <img
                className={s.img}
                src="./images/brain.png"
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
      </div>

      <div className={s.pashalka}> <a href="https://pornhub.com" className={s.pashalka} target="_blank"></a> </div>

      <Popup
        showPopup={showPopup}
        text={"Неправильный логин или пароль!"}
        marginNone={true}
      />
    </>
  );
};
