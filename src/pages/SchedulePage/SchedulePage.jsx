import { useState, useEffect } from "react";
import s from "./SchedulePage.module.scss";
import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { UpdateScheduleTable } from "./components/UpdateScheduleTable/UpdateScheduleTable";
import { getFromLocalStorage, saveToLocalStorage } from "../../modules/localStorageUtils";

export const SchedulePage = () => {
  // Инициализируем состояние из localStorage
  const [view, setView] = useState(() => getFromLocalStorage("scheduleView", "duty"));

  const toggleView = () => {
    setView((prev) => {
      const next = prev === "duty" ? "updates" : "duty";
      saveToLocalStorage("scheduleView", next); // сохраняем выбранный вид
      return next;
    });
  };

  return (
    <ContentWrapper>
      <PageTitle
        titleText={view === "duty" ? "График дежурств" : "График обновлений"}
        center={true}
      />

      <div className={s.toggleWrapper}>
        <button className={s.toggleButton} onClick={toggleView}>
          {view === "duty" ? "График обновлений" : "График дежурств"}
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
