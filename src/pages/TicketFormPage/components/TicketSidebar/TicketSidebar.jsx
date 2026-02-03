import s from "./TicketSidebar.module.scss";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Contacts } from "../Contacts/Contacts";
import { Button } from "../../../../UI/Button/Button";
import { Selector } from "../../../../UI/Selector/Selector";
import { usePopup } from "../../../../context/PopupContext";
import { TaskNotification } from "../../../../components/TaskNotification/TaskNotification";
import { taskStatuses } from "../../../../modules/taskStatuses";
import { updateTaskInfo } from "../../../../api/update/updateTaskInfo";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { useTaskNotifications } from "../../../../hooks/useTaskNotifications";
import { Checkbox } from "../../../../UI/Checkbox/Checkbox";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";
import { Info } from "../../../../UI/Info/Info";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { useActiveTask } from "../../../../context/ActiveTaskContext";

export const TicketSidebar = ({
  taskId,
  taskTitle,
  currentClient,
  currentStatus,
  currentExecutor,
  contacts,
  returnId,
  returnName,
  timeSpent,
  theme,
  isFirstLineTask,
}) => {
  const { employeeOptions, loading: employeesLoading } = useClientsAndEmployees();
  const { showPopup } = usePopup();
  const { activeTask, startTask, clearActiveTask } = useActiveTask(); 

  const { notifications, addNotification, removeNotification } = useTaskNotifications();

  const role = Cookies.get("role");
  const currentUserCode = Cookies.get("userCode");

  const [selectedStatus, setSelectedStatus] = useState(currentStatus ?? "");
  const [selectedExecutor, setSelectedExecutor] = useState(currentExecutor ?? "");
  const [hasChanges, setHasChanges] = useState(false);
  const [isFirstLineTaskState, setIsFirstLineTask] = useState(isFirstLineTask ?? false);

  const [confirmPause, setConfirmPause] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  const validEmployeeOptions = (employeeOptions || []).filter(
    (e) => e?.id && e.id !== "-" && typeof e.name === "string" && e.name.trim() !== "-"
  );

  const statusItems = Object.values(taskStatuses)
    .map(({ code, name }) => ({ id: code, name }))
    .filter((item) => item?.id && item.id !== "-" && item.name?.trim() !== "-");

  // Проверка изменений
  useEffect(() => {
    setHasChanges(
      selectedStatus !== (currentStatus ?? "") ||
      selectedExecutor !== (currentExecutor ?? "")
    );
  }, [selectedStatus, selectedExecutor, currentStatus, currentExecutor]);


// При открытии тикета синхронизируем контекст
useEffect(() => {
  if (taskId && taskTitle) {
    if (!activeTask || activeTask.id !== taskId) {
      startTask({ id: taskId, title: taskTitle });
    }
  }
}, [taskId, taskTitle]);
  const handleStatusChange = (value) => setSelectedStatus(value);
  const handleExecutorChange = (value) => setSelectedExecutor(value);

  const handleSave = async () => {
    if (!selectedStatus || !selectedExecutor) {
      showPopup("Выберите статус и исполнителя", { type: "warning" });
      return;
    }

    if (
      selectedStatus === (currentStatus ?? "") &&
      selectedExecutor === (currentExecutor ?? "")
    ) {
      showPopup("Данные не были изменены", { type: "info" });
      return;
    }

    const formattedTaskId = String(taskId).padStart(9, "0");
    const isInProgress = selectedStatus === taskStatuses.IN_PROGRESS.code;
    const isMyTask = String(selectedExecutor) === String(currentUserCode);

    if (isInProgress && isMyTask && activeTask?.id && activeTask.id !== taskId) {
      setPendingSave({ formattedTaskId, selectedStatus, selectedExecutor });
      setConfirmPause(true);
      return;
    }

    await executeSave({ formattedTaskId, selectedStatus, selectedExecutor });
  };

  const executeSave = async ({ formattedTaskId, selectedStatus, selectedExecutor }) => {
    try {
      const isInProgress = selectedStatus === taskStatuses.IN_PROGRESS.code;
      const isMyTask = String(selectedExecutor) === String(currentUserCode);

      if (isInProgress && isMyTask) {
        if (activeTask?.id && activeTask.id !== taskId) {
          await curentTaskManage(
            String(activeTask.id).padStart(9, "0"),
            taskStatuses.PAUSED.code
          );
          clearActiveTask();
          
          addNotification(`Задача "${activeTask?.title}" на паузе`, "info", 3000);
        }

        await curentTaskManage(formattedTaskId, taskStatuses.IN_PROGRESS.code);
        startTask({ id: taskId, title: taskTitle });
        
        addNotification(`Задача "${taskTitle}" запущена`, "success", 3000);
      }

      await updateTaskInfo(formattedTaskId, selectedStatus, selectedExecutor);
      showPopup("Изменения успешно сохранены", { type: "success" });
      setHasChanges(false);
    } catch (err) {
      console.error(err);
      showPopup("Не удалось сохранить изменения", { type: "error" });
    }
  };

  const handleConfirmPause = async () => {
    setConfirmPause(false);
    if (pendingSave) {
      await executeSave(pendingSave);
      setPendingSave(null);
    }
  };

  const handleCancelPause = () => {
    setConfirmPause(false);
    setPendingSave(null);
  };

  const selectedExecutorName =
    validEmployeeOptions.find((e) => e.id === selectedExecutor)?.name ?? selectedExecutor ?? "";

  const selectedStatusName =
    statusItems.find((e) => e.id === selectedStatus)?.name ?? selectedStatus ?? "";

  const isEmployee = role === import.meta.env.VITE_TOKEN_EMPLOYEE;
  const isManagerOrDuty =
    role === import.meta.env.VITE_TOKEN_MANAGER ||
    role === import.meta.env.VITE_TOKEN_DUTY;

  return (
    <div className={s.wrapper}>
      {/* <div className={s.info}>
        <Info theme={theme} />
      </div> */}

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

      <PopupConfirm
        isOpen={confirmPause}
        text={`Поставить на паузу активную задачу "${activeTask?.title}" и переключиться на "${taskTitle}"?`}
        onConfirm={handleConfirmPause}
        onCancel={handleCancelPause}
      />

       {notifications.map((n) => (
        <TaskNotification key={n.id} {...n} onClose={() => removeNotification(n.id)} />
      ))}
    </div>
  );
};
