import s from "./ProfilePage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const ProfilePage = () => {
  return (
    <ContentWrapper>
        <PageTitle titleText={"Профиль"} center={true} /> 
        <div className={s.profile_wrapper}>
          <div className={s.img_block}>
            <img className={s.img} src="/images/avatars/ava2.jpg" alt="" />
          </div>
        </div>
    </ContentWrapper>
  );
};
