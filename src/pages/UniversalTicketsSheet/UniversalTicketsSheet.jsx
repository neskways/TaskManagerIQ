import s from "./UniversalTicketsSheet.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { TasksTable } from "../../components/TasksTable/TasksTable";
import { SidebarFilter } from "../../components/SidebarFilter/SidebarFilter";
import { useState, useEffect } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";

export const UniversalTicketsSheet = ({ url, titleText }) => {
  const [showFilter, setShowFilter] = useState(() => getFromLocalStorage("showFilter", false));

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <div className={s.btn_wrapper}>
        <button className={s.filter_btn} onClick={() => setShowFilter(prev => !prev)}>Фильтр</button>
      </div>
      <TasksTable showFilter={showFilter} />
      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />
    </div>
  );
};
