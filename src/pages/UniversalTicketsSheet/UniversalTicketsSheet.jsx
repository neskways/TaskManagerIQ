import s from "./UniversalTicketsSheet.module.scss";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import { ModelWindow } from "../../components/ModelWindow/ModelWindow";
import { useClientsAndEmployees } from "../CreateTicketPage/hooks/useClientsAndEmployees";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const openedTaskId = searchParams.get("open")
    ? parseInt(searchParams.get("open"), 10)
    : null;

  const [refetchTrigger, setRefetchTrigger] = useState(0);

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
      <div className={s.titleWrap}>
        <PageTitle titleText={titleText} />
      </div>

      <TasksTable
        queryParams={queryParams}
        onOpenTask={openTask}
        refetchKey={refetchTrigger}
        isTaskOpen={!!openedTaskId}
      />

      <ModelWindow isOpen={!!openedTaskId} onClose={closeTask} isPadding={false}>
        {openedTaskId && (
          <TicketFormPage modal taskId={openedTaskId} onClose={closeTask} />
        )}
      </ModelWindow>
    </div>
  );
};