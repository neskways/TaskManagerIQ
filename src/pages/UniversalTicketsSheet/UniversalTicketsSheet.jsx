import s from "./UniversalTicketsSheet.module.scss";
import { useState, useEffect } from "react";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage"; 
import { getFromLocalStorage, saveToLocalStorage } from "../../modules/localStorageUtils";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  const [openedTaskId, setOpenedTaskId] = useState(null);

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />

      <TasksTable
        queryParams={queryParams}
        onOpenTask={(id) => setOpenedTaskId(id)}
      />

      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />

      {openedTaskId && (
        <div className={s.modalOverlay} onClick={() => setOpenedTaskId(null)}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <TicketFormPage modal taskId={openedTaskId} onClose={() => setOpenedTaskId(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
