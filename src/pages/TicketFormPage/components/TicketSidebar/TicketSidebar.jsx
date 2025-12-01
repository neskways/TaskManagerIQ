import s from "./TicketSidebar.module.scss";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Contacts } from "../Contacts/Contacts";
import { Button } from "../../../../UI/Button/Button";
import { Selector } from "../../../../UI/Selector/Selector";
import { usePopup } from "../../../../context/PopupContext";
import { taskStatuses } from "../../../../modules/taskStatuses";
import { updateTaskInfo } from "../../../../api/update/updateTaskInfo";
import { Checkbox } from "../../../../UI/Checkbox/Checkbox";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";

export const TicketSidebar = ({
  taskId,
  currentClient,
  currentStatus,
  currentExecutor,
  contacts,
  returnId,
  returnName,
  timeSpent,
  isFirstLineTask,
}) => {
  const { employeeOptions, loading: employeesLoading } = useClientsAndEmployees();
  const { showPopup } = usePopup();

  const role = Cookies.get("role");

  const [selectedStatus, setSelectedStatus] = useState(currentStatus ?? "");
  const [selectedExecutor, setSelectedExecutor] = useState(currentExecutor ?? "");
  const [hasChanges, setHasChanges] = useState(false);
  const [isFirstLineTaskState, setIsFirstLineTask] = useState(isFirstLineTask ?? false);

  // фильтруем сотрудников безопасно
  const validEmployeeOptions = (employeeOptions || []).filter(
    (e) =>
      e?.id &&
      e.id !== "-" &&
      typeof e.name === "string" &&
      e.name.trim() !== "-"
  );

  // формируем список статусов безопасно
  const statusItems = Object.values(taskStatuses)
    .map(({ code, name }) => ({ id: code, name: name }))
    .filter((item) => item?.id && item.id !== "-" && item.name?.trim() !== "-");

  // отслеживаем изменения
  useEffect(() => {
    setHasChanges(
      selectedStatus !== (currentStatus ?? "") ||
        selectedExecutor !== (currentExecutor ?? "")
    );
  }, [selectedStatus, selectedExecutor, currentStatus, currentExecutor]);

  const handleStatusChange = (value) => setSelectedStatus(value);
  const handleExecutorChange = (value) => setSelectedExecutor(value);

  const handleSave = async () => {
    if (!selectedStatus || !selectedExecutor) {
      showPopup("Выберите статус и исполнителя", { type: "warning" });
      return;
    }

    if (selectedStatus === (currentStatus ?? "") && selectedExecutor === (currentExecutor ?? "")) {
      showPopup("Данные не были изменены", { type: "info" });
      return;
    }

    try {
      const formattedTaskId = String(taskId).padStart(9, "0");

      await updateTaskInfo(
        formattedTaskId,
        selectedStatus,
        selectedExecutor
      );

      showPopup("Изменения успешно сохранены", { type: "success" });
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      showPopup("Не удалось сохранить изменения", { type: "error" });
    }
  };

  const selectedExecutorName =
    validEmployeeOptions.find((e) => e.id === selectedExecutor)?.name ??
    selectedExecutor ??
    "";

  const selectedStatusName =
    statusItems.find((e) => e.id === selectedStatus)?.name ?? selectedStatus ?? "";

  const isEmployee = role === import.meta.env.VITE_TOKEN_EMPLOYEE;
  const isManagerOrDuty =
    role === import.meta.env.VITE_TOKEN_MANAGER ||
    role === import.meta.env.VITE_TOKEN_DUTY;

  return (
    <div className={s.wrapper}>
      {hasChanges && (
        <div className={s.dirtyIndicator}>
          <p className={s.z}>*</p>
        </div>
      )}

      <div className={s.block}>
        <h4 className={s.title}>Клиент</h4>
        <p className={s.text}>{currentClient ?? ""}</p>
      </div>

      {isEmployee && (
        <>
          <div className={s.block}>
            <h4 className={s.title}>Исполнитель</h4>
            <p className={s.text}>{selectedExecutorName}</p>
          </div>
          <div className={s.block}>
            <h4 className={s.title}>Статус</h4>
            <p className={s.text}>{selectedStatusName}</p>
          </div>
        </>
      )}

      {isManagerOrDuty && (
        <>
          <Selector
            title="Исполнитель"
            alignTitle="center"
            items={validEmployeeOptions}
            labelKey="name"
            valueKey="id"
            value={selectedExecutor}
            smallFont={true}
            onChange={handleExecutorChange}
            disabled={employeesLoading}
          />
          <Selector
            title="Статус задачи"
            alignTitle="center"
            items={statusItems}
            labelKey="name"
            valueKey="id"
            smallFont={true}
            value={selectedStatus}
            onChange={handleStatusChange}
          />
        </>
      )}

      <div className={s.block}>
        <h4 className={s.title}>Время</h4>
        <p className={s.text}>{timeSpent ?? "00:00:00"}</p>
      </div>

      <Contacts contacts={contacts} />

      {returnId != null && (
        <div className={s.block}>
          <h4 className={s.title}>Возвратная заявка</h4>
          <Link to={`/ticket/${returnId}`}>
            <p className={s.text} title={returnName ?? ""}>
              {returnName ?? ""}
            </p>
          </Link>
        </div>
      )}

      {role === import.meta.env.VITE_TOKEN_MANAGER && (
        <div className={s.block}>
          <h4 className={s.title}>Дополнительные данные</h4>
          <div className={s.text}>
            <div className={s.checkbox}>
              <Checkbox
                checked={isFirstLineTaskState}
                onChange={(e) => setIsFirstLineTask(e.target.checked)}
              />
              <p>Задача первой линии</p>
            </div>
            <div className={s.checkbox}>
              <Checkbox
                checked={isFirstLineTaskState}
                onChange={(e) => setIsFirstLineTask(e.target.checked)}
              />
              <p>Выезд к клиенту</p>
            </div>
          </div>
        </div>
      )}

      <div className={s.btn_wrap}>
        <Button name="Сохранить" onClick={handleSave} />
      </div>
    </div>
  );
};
