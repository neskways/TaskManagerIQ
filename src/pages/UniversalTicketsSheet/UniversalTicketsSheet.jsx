import s from "./UniversalTicketsSheet.module.scss";
import { useState } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { ModelWindow } from "../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import { useClientsAndEmployees } from "../CreateTicketPage/hooks/useClientsAndEmployees";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(false);

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [openedTaskId, setOpenedTaskId] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { clients, loading: clientsLoading } = useClientsAndEmployees();

  const openTask = (id) => setOpenedTaskId(id);
  const closeTask = () => setOpenedTaskId(null);

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
        onShowFilter={() => setShowFilter(true)} // <-- передаем функцию
      />

      <SidebarFilter
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedEmployees={selectedEmployees}
        setSelectedEmployees={setSelectedEmployees}
        clients={clients}               // передаём список клиентов
        clientsLoading={clientsLoading} // передаём статус загрузки
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        onReset={() => {
          setSelectedStatuses([]);
          setSelectedEmployees([]);
          setSelectedClient(null);
        }}
      />


      <ModelWindow isOpen={!!openedTaskId} onClose={closeTask} isPadding={false}>
        <TicketFormPage modal taskId={openedTaskId} onClose={closeTask} />
      </ModelWindow>
    </div>
  );
};
