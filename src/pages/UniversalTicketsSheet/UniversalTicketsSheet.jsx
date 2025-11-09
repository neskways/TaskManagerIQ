import s from "./UniversalTicketsSheet.module.scss";
import { useState, useEffect } from "react";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);
  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <TasksTable setShowFilter={setShowFilter} queryParams={queryParams} />
      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />
    </div>
  );
};

