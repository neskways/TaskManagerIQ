import s from "./TimerTasks.module.scss";
import { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";

import { TaskList } from "./components/TaskList/TaskList";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { TaskNotification } from "./components/TaskNotification/TaskNotification";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";

import { usePopup } from "../../../../context/PopupContext";
import { useTaskNotifications } from "./hooks/useTaskNotifications";
import { useTaskAudio } from "../../../../hooks/useTaskAudio";
import { useTasks } from "./hooks/useTasks";
import { useIdleTimer } from "./hooks/useIdleTimer";
import { taskStatuses } from "../../../../modules/taskStatuses";

const COOKIE_LAST_SELECTED = "lastSelectedTaskId";

export const TimerTasks = () => {
  const { showPopup } = usePopup();
  const { play } = useTaskAudio();

  const [modalTaskId, setModalTaskId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [idleModal, setIdleModal] = useState(false);

  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmPause, setConfirmPause] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState(null);
  const [taskToFinish, setTaskToFinish] = useState(null);

  const { notifications, addNotification, removeNotification } =
    useTaskNotifications();

  const {
    tasks,
    secondsMap,
    selectedTaskId,
    setSelectedTaskId,
    activeTaskId,
    setActiveTaskId,
    manageTaskState,
  } = useTasks(showPopup, play);

  useIdleTimer(() => setIdleModal(true), 600000, activeTaskId, idleModal);

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const activeTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) ?? null,
    [tasks, activeTaskId]
  );

  useEffect(() => {
    const lastSelectedId = Cookies.get(COOKIE_LAST_SELECTED);

    if (activeTaskId) {
      setSelectedTaskId(activeTaskId);
      return;
    }

    if (lastSelectedId) {
      const id = Number(lastSelectedId);
      if (tasks.some((t) => t.id === id)) {
        setSelectedTaskId(id);
      }
    }
  }, [tasks, activeTaskId, setSelectedTaskId]);

  const toggleExpand = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      requestAnimationFrame(() => setShowExpanded(true));
    } else {
      setShowExpanded(false);
      setTimeout(() => setIsExpanded(false), 0);
    }
  }, [isExpanded]);

  const onSelectTask = useCallback(
    (taskId) => {
      Cookies.set(COOKIE_LAST_SELECTED, taskId, { expires: 30 });

      if (activeTaskId && activeTaskId !== taskId) {
        setPendingTaskId(taskId);
        setConfirmPause(true);
        return;
      }

      setSelectedTaskId(taskId);
    },
    [activeTaskId, setSelectedTaskId]
  );

  const pauseAndSwitchTask = useCallback(async () => {
    if (!pendingTaskId || !activeTaskId) return;

    setConfirmPause(false);

    const nextTaskId = pendingTaskId;
    setPendingTaskId(null);

    try {

      await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      addNotification(
        `Задача "${activeTask?.title}" на паузе`,
        "info",
        3000
      );

      await manageTaskState(nextTaskId, taskStatuses.IN_PROGRESS.code);
      const nextTask = tasks.find((t) => t.id === nextTaskId);

      addNotification(
        `Задача "${nextTask?.title}" запущена`,
        "success",
        5000
      );

      setActiveTaskId(nextTaskId);
      setSelectedTaskId(nextTaskId);
    } catch (e) {
      showPopup("Ошибка при переключении задачи", "error");
    }
  }, [
    pendingTaskId,
    activeTaskId,
    activeTask,
    tasks,
    manageTaskState,
    addNotification,
    setActiveTaskId,
    setSelectedTaskId,
    showPopup,
  ]);



  const startPauseTask = useCallback(async () => {
    if (!selectedTaskId) return;

    if (activeTaskId === selectedTaskId) {
      await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
      addNotification(`Задача "${selectedTask?.title}" на паузе`, "info", 3000);
      setActiveTaskId(null);
      return;
    }

    if (activeTaskId && activeTask) {
      await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      addNotification(`Задача "${activeTask.title}" на паузе`, "info", 3000);
    }

    await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
    addNotification(`Задача "${selectedTask?.title}" запущена`, "success", 5000);
    setActiveTaskId(selectedTaskId);
  }, [
    selectedTaskId,
    activeTaskId,
    selectedTask,
    activeTask,
    manageTaskState,
    addNotification,
    setActiveTaskId,
  ]);

  const handleFinishClick = useCallback(() => {
    if (!activeTaskId) {
      showPopup("Нет активной задачи", "warning");
      return;
    }
    setTaskToFinish(activeTask);
    setConfirmFinish(true);
  }, [activeTaskId, activeTask, showPopup]);

  const finishTask = useCallback(async () => {
    if (!taskToFinish) return;

    await manageTaskState(taskToFinish.id, taskStatuses.READY.code);
    addNotification(`Задача "${taskToFinish.title}" завершена`, "success", 5000);

    setActiveTaskId(null);
    setConfirmFinish(false);
    setTaskToFinish(null);
  }, [taskToFinish, manageTaskState, addNotification, setActiveTaskId]);

  return (
    <div className={`${s.full_block} ${showExpanded ? s.showF : ""}`}>
      {idleModal && <IdleWarning onClose={() => setIdleModal(false)} />}

      {isExpanded && (
        <div className={`${s.overlay} ${showExpanded ? s.show : ""}`} onClick={toggleExpand} />
      )}

      <div
        className={`${s.wrapper} ${isExpanded ? s.expandedWrapper : ""} ${showExpanded ? s.show : ""
          }`}
      >
        <ExpandButton expanded={isExpanded} onToggle={toggleExpand} />

        <TimerHeader
          selectedTask={selectedTask}
          isRunning={activeTaskId === selectedTaskId}
          displaySec={secondsMap[selectedTaskId] ?? 0}
          onStartPause={startPauseTask}
          onFinish={handleFinishClick}
          isExpanded={isExpanded}
        />

        <TaskList
          tasks={tasks}
          secondsMap={secondsMap}
          selectedTaskId={selectedTaskId}
          isExpanded={isExpanded}
          onSelectTask={onSelectTask}
          onOpenModal={setModalTaskId}
        />
      </div>

      <PopupConfirm
        isOpen={confirmFinish}
        text={`Завершить "${taskToFinish?.title}"?`}
        onConfirm={finishTask}
        onCancel={() => setConfirmFinish(false)}
      />

      <PopupConfirm
        isOpen={confirmPause}
        text={`Поставить активную задачу на паузу и переключиться на "${tasks.find(
          (t) => t.id === pendingTaskId
        )?.title}"?`}
        onConfirm={pauseAndSwitchTask}
        onCancel={() => {
          setConfirmPause(false);
          setPendingTaskId(null);
        }}
      />

      {notifications.map((n) => (
        <TaskNotification key={n.id} {...n} onClose={() => removeNotification(n.id)} />
      ))}

      <ModelWindow isOpen={!!modalTaskId} onClose={() => setModalTaskId(null)}>
        <TicketFormPage modal taskId={modalTaskId} />
      </ModelWindow>
    </div>
  );
};
