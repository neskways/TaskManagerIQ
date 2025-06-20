import s from "./LoginPage.module.scss";
import { useState } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Popup } from "../../UI/Popup/Popup";

export const LoginPage = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorIn, setIsErrorIn] = useState(false);

  const handleLogin = async (e) => {
      e.preventDefault();

     setShowPopup(true);

      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);

      return () => clearTimeout(timer);
  }

  return (
    <>  
      <div className={s.inner}>
        <div className={s.wrapper}>
          <h2 className={s.title}>Вход в IQProg Support</h2>
          <form className={s.form} onSubmit={handleLogin}>
            <div className={s.img_wrap}>
              <img className={s.img} src="./images/brain.png" alt="" />
            </div>
            <Input
              text="Логин / Email"
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
            <div className={s.remember_me_wrap}>
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">запомнить меня</label>
            </div>
            {/* <div className={s.wrap_error_text}>
              <p
                className={`${s.error_password_text} ${
                  isErrorIn ? s.error_password_text_show : ""
                }`}
              >
                Введен неправильный логин или пароль
              </p>
            </div> */}
            <div className={s.button_wrap}>
              <Button name="Войти" type="submit" />
            </div>
          </form>
        </div>
      </div>
      <Popup showPopup={showPopup} text={"Не правильный логин или пароль!"} />
    </>
  );
}
