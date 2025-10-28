import s from "./ProfilePage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import Cookies from "js-cookie";
import { useTheme } from "../../context/ThemeContext";

export const ProfilePage = () => {

  const username = Cookies.get("username");
  const { theme } = useTheme();
  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";
  const token = Cookies.get("token");

  return (
    <>
      <div className={s.wrapper}>
        <div className={s.inner}>
          <PageTitle titleText={"Профиль"} center={true} />
          <div className={s.profile_wrapper}>
            <div className={s.img_block}>
              <img className={s.img} src="/images/avatars/ava2.jpg" alt="" />
            </div>
            <div className={s.text_block}>
              <h3 className={s.username}> {username} </h3>
              <a
                className={s.iqcompany}
                href="https://iqprog.ru/"
                target="_black"
              >
                {" "}
                АйКю Компани{" "}
              </a>
              <p>{token}</p>
            </div>
          </div>
        </div>
        <img className={s.logo_opacity} src={theme === "light" ? lightLogo : darkLogo} alt="" />
      </div>   
    </>
  );
};
