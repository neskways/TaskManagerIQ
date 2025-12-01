import s from "./UniversalTicketsSheet.module.scss";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import { ModelWindow } from "../../components/ModelWindow/ModelWindow";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { useClientsAndEmployees } from "../CreateTicketPage/hooks/useClientsAndEmployees";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilter, setShowFilter] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const openedTaskId = searchParams.get("open")
    ? parseInt(searchParams.get("open"), 10)
    : null;

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { clients, loading: clientsLoading } = useClientsAndEmployees();

  const openTask = (id) => {
    setSearchParams((prev) => {
      prev.set("open", id);
      return prev;
    });
  };

  const closeTask = () => {
    setSearchParams((prev) => {
      prev.delete("open");
      return prev;
    });
  };

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />

      <TasksTable
        queryParams={queryParams}
        selectedStatuses={selectedStatuses}
        selectedEmployees={selectedEmployees}
        selectedClient={selectedClient}
        onOpenTask={openTask}
        refetchKey={refetchTrigger}
        isTaskOpen={!!openedTaskId}
        onShowFilter={() => setShowFilter(true)}
      />

      <SidebarFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        clients={clients}
        clientsLoading={clientsLoading}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        onReset={() => {
          setSelectedStatuses([]);
          setSelectedEmployees([]);
          setSelectedClient(null);
        }}
      />

      <ModelWindow isOpen={!!openedTaskId} onClose={closeTask} isPadding={false}>
        {openedTaskId && (
          <TicketFormPage modal taskId={openedTaskId} onClose={closeTask} />
        )}
      </ModelWindow>
    </div>
  );
};
