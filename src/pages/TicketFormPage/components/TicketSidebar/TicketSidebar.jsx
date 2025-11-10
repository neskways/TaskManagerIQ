import { useState, useEffect } from "react";
import s from "./TicketSidebar.module.scss";
import { Button } from "../../../../UI/Button/Button";
import { Selector } from "../../../../UI/Selector/Selector";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";

export const TicketSidebar = ({ currentClient, currentStatus, currentExecutor }) => {
  const { employeeOptions, loading: employeesLoading } = useClientsAndEmployees();

  const statusItems = Object.entries(taskStatuses).map(([key, { code, title }]) => ({
    id: code,
    name: title,
  }));

  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "");
  const [selectedExecutor, setSelectedExecutor] = useState(currentExecutor || "");
  const [hasChanges, setHasChanges] = useState(false);

  // отслеживаем изменения
  useEffect(() => {
    setHasChanges(
      selectedStatus !== currentStatus || selectedExecutor !== currentExecutor
    );
  }, [selectedStatus, selectedExecutor, currentStatus, currentExecutor]);

  const handleStatusChange = (value) => setSelectedStatus(value);
  const handleExecutorChange = (value) => setSelectedExecutor(value);

  return (
    <div className={s.wrapper}>
      {/* Индикатор изменений в верхнем правом углу */}
      {hasChanges && <div className={s.dirtyIndicator}><p className={s.z}>*</p></div>}

      <div className={s.block}>
        <h4 className={s.title}> Клиент </h4>
        <p className={s.text}> { currentClient } </p>
      </div>

      <Selector
        title="Статус задачи"
        alignTitle="center"
        items={statusItems}
        labelKey="name"
        valueKey="id"
        value={selectedStatus}
        onChange={handleStatusChange}
      />

      <Selector
        title="Исполнитель"
        alignTitle="center"
        items={employeeOptions}
        labelKey="name"
        valueKey="id"
        value={selectedExecutor}
        onChange={handleExecutorChange}
        disabled={employeesLoading}
      />

      <div className={s.btn_wrap}>
        <Button
          name="Сохранить"
          onClick={() =>
            console.log("Сохраняем изменения:", {
              статус: selectedStatus,
              исполнитель: selectedExecutor,
            })
          }
        />
      </div>
    </div>
  );
};
