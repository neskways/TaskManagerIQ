import s from "./MainPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const MainPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText={"Главная"} center={true} />
    </ContentWrapper>
  );
};
