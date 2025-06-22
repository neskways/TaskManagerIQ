import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import s from "./ProfilePage.module.scss";

export const ProfilePage = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h2 className={s.title}>Профиль</h2>
        <WorkImg />
      </div>
    </div>
  );
};
