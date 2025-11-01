import s from "./ProfilePage.module.scss";
import Cookies from "js-cookie";
import { useTheme } from "../../context/ThemeContext";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ProfileBlock } from "./Components/ProfileBlock/ProfileBlock";

export const ProfilePage = () => {

  const username = Cookies.get("username");
  const { theme } = useTheme();
  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const UserCode = Cookies.get("userCode");

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
              <p className={s.role}> {role} </p>
              <a
                className={s.iqcompany}
                href="https://iqprog.ru/"
                target="_black"
              >
                {" "}
                АйКю Компани{" "}
              </a>
            </div>
          </div>
          <h4 className={s.second_title}>Текущие задачи</h4>
              {/* <p className={s.role}> {token} </p> */}
          { UserCode === "000000002" && <ProfileBlock/> }
        
        </div>
        <img className={s.logo_opacity} src={theme === "light" ? lightLogo : darkLogo} alt="" />
      </div>   
    </>
  );
};
