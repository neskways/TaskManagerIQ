import s from "./TicketSidebar.module.scss";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Button } from "../../../../UI/Button/Button";
import { Contacts } from "../Contacts/Contacts";
import { Selector } from "../../../../UI/Selector/Selector";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";
import { usePopup } from "../../../../context/PopupContext";
import { updateTaskInfo } from "../../../../api/update/updateTaskInfo";

export const TicketSidebar = ({
  taskId,
  currentClient,
  currentStatus,
  currentExecutor,
  contacts,
}) => {
  const { employeeOptions, loading: employeesLoading } = useClientsAndEmployees();
  const { showPopup } = usePopup();

  const role = Cookies.get("role");

  const [selectedStatus, setSelectedStatus] = useState(currentStatus || "");
  const [selectedExecutor, setSelectedExecutor] = useState(currentExecutor || "");
  const [hasChanges, setHasChanges] = useState(false);

  // фильтруем сотрудников без "пустых" или "-" значений
  const validEmployeeOptions = employeeOptions.filter(
    (e) => e.id && e.id !== "-" && e.name && e.name.trim() !== "-"
  );

  // формируем список статусов без "пустых"
  const statusItems = Object.entries(taskStatuses)
    .map(([_, { code, title }]) => ({
      id: code,
      name: title,
    }))
    .filter((item) => item.id && item.id !== "-" && item.name.trim() !== "-");

  // отслеживаем изменения
  useEffect(() => {
    setHasChanges(
      selectedStatus !== currentStatus || selectedExecutor !== currentExecutor
    );
  }, [selectedStatus, selectedExecutor, currentStatus, currentExecutor]);

  const handleStatusChange = (value) => setSelectedStatus(value);
  const handleExecutorChange = (value) => setSelectedExecutor(value);

  const handleSave = async () => {
    const statusChanged = selectedStatus !== currentStatus;
    const executorChanged = selectedExecutor !== currentExecutor;

    if (!selectedStatus || !selectedExecutor) {
      showPopup("Выберите статус и исполнителя", { type: "warning" });
      return;
    }

    if (!statusChanged && !executorChanged) {
      showPopup("Данные не были изменены", { type: "info" });
      return;
    }

    try {
      const formattedTaskId = String(taskId).padStart(9, "0");

      const stateToSend = statusChanged ? selectedStatus : currentStatus;
      const ownerToSend = executorChanged ? selectedExecutor : currentExecutor;

      await updateTaskInfo(formattedTaskId, stateToSend, ownerToSend);

      showPopup("Изменения успешно сохранены", { type: "success" });

      setHasChanges(false);
    } catch (err) {
      console.error(err);
      showPopup("Не удалось сохранить изменения", { type: "error" });
    }
  };

  const selectedExecutorName =
    validEmployeeOptions.find((e) => e.id === selectedExecutor)?.name ||
    selectedExecutor;

  return (
    <div className={s.wrapper}>
      {hasChanges && (
        <div className={s.dirtyIndicator}>
          <p className={s.z}>*</p>
        </div>
      )}

      <div className={s.block}>
        <h4 className={s.title}>Клиент</h4>
        <p className={s.text}>{currentClient}</p>
      </div>

      {role === import.meta.env.VITE_TOKEN_EMPLOYEE && (
        <div className={s.block}>
          <h4 className={s.title}>Исполнитель</h4>
          <p className={s.text}>{selectedExecutorName}</p>
        </div>
      )}

      {(role === import.meta.env.VITE_TOKEN_MANAGER ||
        role === import.meta.env.VITE_TOKEN_DUTY) && (
        <>
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
            items={validEmployeeOptions}
            labelKey="name"
            valueKey="id"
            value={selectedExecutor}
            onChange={handleExecutorChange}
            disabled={employeesLoading}
          />
        </>
      )}

      <Contacts contacts={contacts} />

      <div className={s.btn_wrap}>
        <Button name="Сохранить" onClick={handleSave} />
      </div>
    </div>
  );
};
