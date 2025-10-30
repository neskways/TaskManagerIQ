import s from "./SchedulePage.module.scss";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { UpdateScheduleTable } from "./components/UpdateScheduleTable/UpdateScheduleTable";
import { getFromLocalStorage, saveToLocalStorage } from "../../modules/localStorageUtils";

export const SchedulePage = () => {
  
  const [view, setView] = useState(() =>
    getFromLocalStorage("scheduleView", "duty")
  );
  const { theme } = useTheme();
  const tabsRef = useRef(null);

  const handleTabChange = (tab) => {
    setView(tab);
    saveToLocalStorage("scheduleView", tab);
  };

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;

    const active = tabs.querySelector(`.${s.active}`);
    if (!active) return;

    const { offsetLeft, offsetWidth } = active;
    tabs.style.setProperty("--underline-left", `${offsetLeft}px`);
    tabs.style.setProperty("--underline-width", `${offsetWidth}px`);
  }, [view]);

  return (
    <ContentWrapper>
      <PageTitle
        titleText={view === "duty" ? "График дежурств" : "График обновлений"}
        center={true}
      />

      <div className={s.tabs} ref={tabsRef}>
        <button
          className={`${s.tab} ${view === "duty" ? s.active : ""}`}
          onClick={() => handleTabChange("duty")}
        >
          График дежурств
        </button>
        <button
          className={`${s.tab} ${view === "updates" ? s.active : ""}`}
          onClick={() => handleTabChange("updates")}
        >
          График обновлений
        </button>
      </div>

      <div className={s.contentWrapper}>
        <AnimatePresence exitBeforeEnter>
          {view === "duty" ? (
            <motion.div
              key="duty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={s.absoluteContent}
            >
              <Calendar theme={theme} />
            </motion.div>
          ) : (
            <motion.div
              key="updates"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={s.absoluteContent}
            >
              <UpdateScheduleTable theme={theme} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ContentWrapper>
  );
};
