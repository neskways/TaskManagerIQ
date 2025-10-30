import s from "./UniversalTicketsSheet.module.scss";
import { getTasksList } from "../../api/get/getTasksList";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { useState, useEffect } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";

export const UniversalTicketsSheet = ({ titleText }) => {
  
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <TasksTable setShowFilter={setShowFilter} />
      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />
    </div>
  );
};
