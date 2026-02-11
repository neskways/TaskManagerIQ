import s from "./StatisticsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ReportForm } from "./components/ReportForm/ReportForm";

export const StatisticsPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText={"Статистика"} center={true} />
      <div className={s.content}>
        <Sidebar />
        <ReportForm />
      </div>
    </ContentWrapper>
  );
};
