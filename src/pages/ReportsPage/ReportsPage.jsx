import { useState } from "react";
import s from "./ReportsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ReportForm } from "./components/ReportForm/ReportForm";
import { REPORTS } from "./reports";

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(REPORTS[0]);

  return (
    <ContentWrapper>
      <PageTitle titleText={selectedReport.title} center />

      <div className={s.content}>
        <Sidebar
          reports={REPORTS}
          selectedReport={selectedReport}
          onSelect={setSelectedReport}
        />

        <ReportForm selectedReport={selectedReport} />
      </div>
    </ContentWrapper>
  );
};