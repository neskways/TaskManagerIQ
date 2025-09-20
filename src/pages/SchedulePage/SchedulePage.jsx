import { useState } from "react";
import s from "./SchedulePage.module.scss";
import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { UpdateScheduleTable } from "./components/UpdateScheduleTable/UpdateScheduleTable";

export const SchedulePage = () => {
  const [view, setView] = useState("duty"); // 'duty' или 'updates'

  const toggleView = () => {
    setView((prev) => (prev === "duty" ? "updates" : "duty"));
  };

  return (
    <ContentWrapper>
      <PageTitle
        titleText={view === "duty" ? "График дежурств" : "График обновлений"}
        center={true}
      />

      <div className={s.toggleWrapper}>
        <button className={s.toggleButton} onClick={toggleView}>
          {view === "duty"
            ? "График обновлений"
            : "График дежурств"}
        </button>
      </div>

      <div className={s.contentWrapper}>
        {view === "duty" ? (
          <Calendar showInitialLoadingOnly={true} />
        ) : (
          <UpdateScheduleTable />
        )}
      </div>
    </ContentWrapper>
  );
};
