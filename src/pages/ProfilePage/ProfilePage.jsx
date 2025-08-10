import s from "./ProfilePage.module.scss";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const ProfilePage = () => {
  return (
    <ContentWrapper>
        <PageTitle titleText={"Профиль"} center={true} /> 
        <WorkImg />
    </ContentWrapper>
  );
};
