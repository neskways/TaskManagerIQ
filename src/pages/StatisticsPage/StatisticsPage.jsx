import s from "./StatisticsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const StatisticsPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText={"Статистика"} center={true} />
    </ContentWrapper>
  );
};
