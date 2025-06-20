import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import s from "./ProfilePage.module.scss";

export const ProfilePage = () => {
  
  return (
    <div>
      <PageTitle titleText={"Профиль"} />
      <WorkImg/>
    </div>
  );
};
