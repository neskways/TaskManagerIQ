import s from "./UniversalTicketsSheet.module.scss";
import { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import { useLocation, useNavigate } from "react-router-dom";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { ModelWindow } from "../../components/ModelWindow/ModelWindow";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [openedTaskId, setOpenedTaskId] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // читаем id задачи из URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setOpenedTaskId(params.get("open"));
  }, [location]);

  const openTaskViaUrl = (id) => {
    const params = new URLSearchParams(location.search);
    params.set("open", id);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete("open");
    navigate(`${location.pathname}?${params.toString()}`);

    setRefetchTrigger((p) => p + 1);
  };

  const applyFilter = () => {
    setShowFilter(false);
  };

  const resetFilter = () => {
    setSelectedStatuses([]);
  };

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />

      <TasksTable
        queryParams={queryParams}
        selectedStatuses={selectedStatuses}
        onOpenTask={openTaskViaUrl}
        refetchKey={refetchTrigger}
        isTaskOpen={!!openedTaskId}
      />

      <SidebarFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        onApply={applyFilter}
        onReset={resetFilter}
      />

      <ModelWindow isOpen={!!openedTaskId} onClose={closeModal} isPadding={false}>
        <TicketFormPage modal taskId={openedTaskId} onClose={closeModal} />
      </ModelWindow>
    </div>
  );
};
