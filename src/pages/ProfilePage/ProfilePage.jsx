import s from "./ProfilePage.module.scss";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import { PageTitle } from "../../components/PageTitle/PageTitle";

export const ProfilePage = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"Профиль"} center={true} /> 
        <WorkImg />
      </div>
    </div>
  );
};
