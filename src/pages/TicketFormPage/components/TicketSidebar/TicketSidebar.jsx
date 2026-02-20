import s from "./TicketSidebar.module.scss";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Contacts } from "../Contacts/Contacts";
import { Button } from "../../../../UI/Button/Button";
import { Selector } from "../../../../UI/Selector/Selector";
import { usePopup } from "../../../../context/PopupContext";
import { TaskNotification } from "../../../../components/TaskNotification/TaskNotification";
import { taskStatuses, statusTransitions } from "../../../../modules/taskStatuses";
import { updateTaskInfo } from "../../../../api/update/updateTaskInfo";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { useTaskNotifications } from "../../../../hooks/useTaskNotifications";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { useActiveTask } from "../../../../context/ActiveTaskContext";
import { NumberInput } from "./components/NumberInput/NumberInput";

export const TicketSidebar = ({
  taskId,
  taskTitle,
  currentClient,
  currentStatus,
  currentExecutor,
  contacts,
  returnId,
  firstline,
  outoffice,
  returnName,
  timeSpent = "00:00:00",
  currentMileage = 0,
  isFirstLineTask,
}) => {
  const { employeeOptions, loading: employeesLoading } = useClientsAndEmployees();
  const { showPopup } = usePopup();
  const { activeTask, startTask } = useActiveTask();
  const { notifications, addNotification, removeNotification } = useTaskNotifications();

  const role = Cookies.get("role");
  const currentUserCode = Cookies.get("userCode");

  const timeStringToMinutes = (time) => {
    if (!time || typeof time !== "string") return 0;
    const [hours = "0", minutes = "0"] = time.split(":");
    return Number(hours) * 60 + Number(minutes);
  };

  const minutesToTimeString = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
  };


  const [selectedStatus, setSelectedStatus] = useState(currentStatus ?? "");
  const [selectedExecutor, setSelectedExecutor] = useState(currentExecutor ?? "");

  const [savedStatus, setSavedStatus] = useState(currentStatus ?? "");
  const [savedExecutor, setSavedExecutor] = useState(currentExecutor ?? "");

  const [timeInMinutes, setTimeInMinutes] = useState(
    timeStringToMinutes(timeSpent)
  );
  const [savedTime, setSavedTime] = useState(
    timeStringToMinutes(timeSpent)
  );

  const [mileage, setMileage] = useState(currentMileage ?? 0);
  const [savedMileage, setSavedMileage] = useState(currentMileage ?? 0);

  const [hasChanges, setHasChanges] = useState(false);
  const [isFirstLineTaskState, setIsFirstLineTask] = useState(isFirstLineTask ?? false);

  const [confirmPause, setConfirmPause] = useState(false);
  const [pendingSave, setPendingSave] = useState(null);

  // синхронизация при смене задачи
  useEffect(() => {
    setSelectedStatus(currentStatus ?? "");
    setSelectedExecutor(currentExecutor ?? "");
    setSavedStatus(currentStatus ?? "");
    setSavedExecutor(currentExecutor ?? "");

    const minutes = timeStringToMinutes(timeSpent);
    setTimeInMinutes(minutes);
    setSavedTime(minutes);

    setMileage(currentMileage ?? 0);
    setSavedMileage(currentMileage ?? 0);

  }, [currentStatus, currentExecutor, taskId, timeSpent, currentMileage]);

  // индикатор изменений
  useEffect(() => {
    setHasChanges(
      selectedStatus !== savedStatus ||
      selectedExecutor !== savedExecutor ||
      timeInMinutes !== savedTime ||
      mileage !== savedMileage
    );
  }, [
    selectedStatus,
    selectedExecutor,
    savedStatus,
    savedExecutor,
    timeInMinutes,
    savedTime,
    mileage,
    savedMileage,
  ]);

  // активная задача
  useEffect(() => {
    if (taskId && taskTitle) {
      if (!activeTask || activeTask.id !== taskId) {
        startTask({ id: taskId, title: taskTitle });
      }
    }
  }, [taskId, taskTitle]);

  const handleSave = async () => {
    if (!selectedStatus || !selectedExecutor) {
      showPopup("Выберите статус и исполнителя", { type: "warning" });
      return;
    }

    if (
      selectedStatus === savedStatus &&
      selectedExecutor === savedExecutor &&
      timeInMinutes === savedTime &&
      mileage === savedMileage
    ) {
      showPopup("Данные не были изменены", { type: "info" });
      return;
    }

    const formattedTaskId = String(taskId).padStart(9, "0");
    const isInProgress = selectedStatus === taskStatuses.IN_PROGRESS.code;
    const isMyTask = String(selectedExecutor) === String(currentUserCode);

    if (isInProgress && isMyTask && activeTask?.id && activeTask.id !== taskId) {
      setPendingSave({
        formattedTaskId,
        selectedStatus,
        selectedExecutor,
        timeInMinutes,
        mileage,
      });
      setConfirmPause(true);
      return;
    }

    await executeSave({
      formattedTaskId,
      selectedStatus,
      selectedExecutor,
      timeInMinutes,
      mileage,
    });
  };

  const executeSave = async ({
    formattedTaskId,
    selectedStatus,
    selectedExecutor,
    timeInMinutes,
    mileage,
  }) => {
    try {
      const isInProgress = selectedStatus === taskStatuses.IN_PROGRESS.code;
      const isMyTask = String(selectedExecutor) === String(currentUserCode);
      console.log(isInProgress);
      console.log(isMyTask);

      // if (isInProgress && isMyTask) {
      //   await curentTaskManage(formattedTaskId, taskStatuses.IN_PROGRESS.code);
      //   startTask({ id: taskId, title: taskTitle });
      //   addNotification(`Задача "${taskTitle}" запущена`, "success", 3000);
      // }

      await updateTaskInfo(
        formattedTaskId,
        selectedStatus,
        selectedExecutor,
        timeInMinutes,
        mileage
      );

      setSavedStatus(selectedStatus);
      setSavedExecutor(selectedExecutor);
      setSavedTime(timeInMinutes);
      setSavedMileage(mileage);

      showPopup("Изменения успешно сохранены", { type: "success" });
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

  const validEmployeeOptions = (employeeOptions || []).filter(
    (e) =>
      e?.id &&
      e.id !== "-" &&
      typeof e.name === "string" &&
      e.name.trim() !== "-"
  );

  const allStatusItems = useMemo(() => {
    return Object.values(taskStatuses)
      .map(({ code, name }) => ({ id: code, name }))
      .filter((item) => item?.id && item.name?.trim() !== "-");
  }, []);

  const allowedStatuses = statusTransitions[savedStatus] ?? [];

  const statusItems = useMemo(() => {
    if (!savedStatus) return allStatusItems;

    return allStatusItems.filter(
      (status) =>
        status.id === savedStatus ||
        allowedStatuses.includes(status.id)
    );
  }, [allStatusItems, savedStatus, allowedStatuses]);

  const selectedExecutorName =
    validEmployeeOptions.find((e) => e.id === selectedExecutor)?.name ??
    selectedExecutor ??
    "";

  const selectedStatusName =
    allStatusItems.find((e) => e.id === selectedStatus)?.name ??
    selectedStatus ??
    "";

  const isEmployee = role === import.meta.env.VITE_TOKEN_EMPLOYEE;
  const isManagerOrDuty =
    role === import.meta.env.VITE_TOKEN_MANAGER ||
    role === import.meta.env.VITE_TOKEN_DUTY;
  const isManagerOrAdmin =
    role === import.meta.env.VITE_TOKEN_MANAGER ||
    role === import.meta.env.VITE_TOKEN_ADMIN;

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
            smallFont
            onChange={setSelectedExecutor}
            disabled={employeesLoading}
          />

          <Selector
            title="Статус задачи"
            alignTitle="center"
            items={statusItems}
            labelKey="name"
            valueKey="id"
            smallFont
            value={selectedStatus}
            onChange={setSelectedStatus}
          />
        </>
      )}

      {isManagerOrAdmin && (
        <div className={s.block}>
          <h4 className={s.title}>Время</h4>
          <NumberInput
            value={timeInMinutes}
            onChange={setTimeInMinutes}
          />
        </div>
      )}

      {isManagerOrAdmin && (
        <div className={s.block}>
          <h4 className={s.title}>Километраж</h4>
          <NumberInput
            value={mileage}
            onChange={setMileage}
          />
        </div>
      )}

      {isEmployee && (
        <div className={s.block}>
          <h4 className={s.title}>Время</h4>
          <p className={s.text}>{timeSpent ?? "00:00:00"}</p>
        </div>
      )}

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
        <TaskNotification
          key={n.id}
          {...n}
          onClose={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
};