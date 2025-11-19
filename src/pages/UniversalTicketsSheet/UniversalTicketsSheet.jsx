import s from "./UniversalTicketsSheet.module.scss";
import { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { ModelWindow } from "../../components/ModelWindow/ModelWindow";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [openedTaskId, setOpenedTaskId] = useState(null);

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get("open");
    setOpenedTaskId(open);
  }, [location]);

  const openTaskViaUrl = (id) => {
    const params = new URLSearchParams(location.search);
    params.set("open", id);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  const closeModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete("open");
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });

    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />

      <TasksTable
        queryParams={queryParams}
        onOpenTask={openTaskViaUrl}
        refetchKey={refetchTrigger}    // ← передаём триггер
      />

      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />

      <ModelWindow isOpen={!!openedTaskId} onClose={closeModal} isPadding={false}>
        <TicketFormPage modal taskId={openedTaskId} onClose={closeModal} />
      </ModelWindow>
    </div>
  );
};
