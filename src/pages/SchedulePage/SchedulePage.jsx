import { useState } from "react";
import s from "./SchedulePage.module.scss";
import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

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
            ? "Показать график обновлений"
            : "Показать график дежурств"}
        </button>
      </div>

      <div className={s.contentWrapper}>
        {view === "duty" ? (
          <Calendar showInitialLoadingOnly={true} />
        ) : (
          <div className={s.placeholder}>
            Компонент "График обновлений" ещё не готов.
          </div>
        )}
      </div>
    </ContentWrapper>
  );
};
