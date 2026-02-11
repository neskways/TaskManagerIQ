import s from "./TimerTasks.module.scss";
import { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";

import { TaskList } from "./components/TaskList/TaskList";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { TaskNotification } from "../../../TaskNotification/TaskNotification";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";

import { usePopup } from "../../../../context/PopupContext";
import { useActiveTask } from "../../../../context/ActiveTaskContext";
import { useTaskNotifications } from "../../../../hooks/useTaskNotifications";
import { useTaskAudio } from "../../../../hooks/useTaskAudio";
import { useTasks } from "./hooks/useTasks";
import { useIdleTimer } from "./hooks/useIdleTimer";
import { taskStatuses } from "../../../../modules/taskStatuses";

const COOKIE_LAST_SELECTED = "lastSelectedTaskId";

export const TimerTasks = () => {

  const { showPopup } = usePopup();
  const { play } = useTaskAudio();
  const { activeTask, startTask, clearActiveTask } = useActiveTask();

  const [modalTaskId, setModalTaskId] = useState(null);
  const [modalTask, setModalTask] = useState(null);
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
    refreshTasks,
  } = useTasks(showPopup, play);

  // -------------------------------------------------
  // Выбранная задача
  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const currentActiveTask = useMemo(
    () => tasks.find((t) => t.id === activeTaskId) ?? null,
    [tasks, activeTaskId]
  );

  const pendingTask = useMemo(
    () => tasks.find((t) => t.id === pendingTaskId) ?? null,
    [tasks, pendingTaskId]
  );

  // -------------------------------------------------
  // Синхронизация selectedTask с cookie
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
        return;
      }
    }

    if (tasks.length > 0) {
      setSelectedTaskId(tasks[0].id);
    }
  }, [tasks, activeTaskId, setSelectedTaskId]);

  // -------------------------------------------------
  // Синхронизация activeTask с контекстом
  useEffect(() => {
    if (!activeTaskId || tasks.length === 0) return;

    const taskInList = tasks.find((t) => t.id === activeTaskId);

    if (taskInList && (!activeTask || activeTask.id !== taskInList.id)) {
      startTask({ id: taskInList.id, title: taskInList.title });
    } else if (!taskInList && activeTask) {
      clearActiveTask();
    }
  }, [tasks, activeTaskId, activeTask, startTask, clearActiveTask]);

  // -------------------------------------------------
  // Раскрытие панели
  const toggleExpand = useCallback(() => {
    if (!isExpanded) {
      setIsExpanded(true);
      requestAnimationFrame(() => setShowExpanded(true));
    } else {
      setShowExpanded(false);
      setTimeout(() => setIsExpanded(false), 0);
    }
  }, [isExpanded]);

  // -------------------------------------------------
  // Выбор задачи
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

  // -------------------------------------------------
  // Пауза и переключение
  const pauseAndSwitchTask = useCallback(async () => {
    if (!pendingTaskId || !activeTaskId) return;

    setConfirmPause(false);

    const nextTaskId = pendingTaskId;
    setPendingTaskId(null);

    try {
      await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);

      if (currentActiveTask) {
        addNotification(
          `Задача "${currentActiveTask.title}" на паузе`,
          "info",
          3000
        );
      }

      await manageTaskState(nextTaskId, taskStatuses.IN_PROGRESS.code);

      setActiveTaskId(nextTaskId);
      setSelectedTaskId(nextTaskId);

      if (pendingTask) {
        startTask({ id: pendingTask.id, title: pendingTask.title });
        addNotification(
          `Задача "${pendingTask.title}" запущена`,
          "success",
          3000
        );
      }

      // больше не обновляем secondsMap каждую секунду
      // refreshTasks можно оставить для синхронизации с сервером при смене задачи
      await refreshTasks();
    } catch (err) {
      console.error(err);
      showPopup("Ошибка при переключении задачи", { type: "error" });
    }
  }, [
    pendingTaskId,
    activeTaskId,
    currentActiveTask,
    pendingTask,
    manageTaskState,
    addNotification,
    setActiveTaskId,
    setSelectedTaskId,
    startTask,
    refreshTasks,
    showPopup,
  ]);

  useEffect(() => {
    if (activeTaskId) return;

    const timer = setTimeout(() => {
      setIdleModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [activeTaskId]);

  // -------------------------------------------------
  // Старт / пауза
  const startPauseTask = useCallback(async () => {
    if (!selectedTaskId) return;

    try {
      if (activeTaskId === selectedTaskId) {
        await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);

        if (selectedTask) {
          addNotification(
            `Задача "${selectedTask.title}" на паузе`,
            "info",
            3000
          );
        }

        setActiveTaskId(null);
        clearActiveTask();
        return;
      }

      if (activeTaskId && currentActiveTask) {
        await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);

        addNotification(
          `Задача "${currentActiveTask.title}" на паузе`,
          "info",
          3000
        );
      }

      await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);

      if (selectedTask) {
        addNotification(
          `Задача "${selectedTask.title}" запущена`,
          "success",
          5000
        );

        startTask({ id: selectedTask.id, title: selectedTask.title });
      }

      setActiveTaskId(selectedTaskId);

      await refreshTasks();
    } catch (err) {
      console.error(err);
      showPopup("Ошибка при смене статуса задачи", { type: "error" });
    }
  }, [
    selectedTaskId,
    activeTaskId,
    selectedTask,
    currentActiveTask,
    manageTaskState,
    addNotification,
    setActiveTaskId,
    startTask,
    clearActiveTask,
    refreshTasks,
    showPopup,
  ]);

  // -------------------------------------------------
  // Завершение
  const handleFinishClick = useCallback(() => {
    if (!activeTaskId) {
      showPopup("Нет активной задачи", { type: "warning" });
      return;
    }
    setTaskToFinish(currentActiveTask);
    setConfirmFinish(true);
  }, [activeTaskId, currentActiveTask, showPopup]);

  const finishTask = useCallback(async () => {
    if (!taskToFinish) return;

    try {
      await manageTaskState(taskToFinish.id, taskStatuses.READY.code);

      addNotification(
        `Задача "${taskToFinish.title}" завершена`,
        "success",
        5000
      );

      setActiveTaskId(null);
      clearActiveTask();
      setConfirmFinish(false);
      setTaskToFinish(null);

      await refreshTasks();
    } catch (err) {
      console.error(err);
      showPopup("Ошибка при завершении задачи", { type: "error" });
    }
  }, [
    taskToFinish,
    manageTaskState,
    addNotification,
    setActiveTaskId,
    clearActiveTask,
    refreshTasks,
    showPopup,
  ]);

  // -------------------------------------------------
  // Модалка
  useEffect(() => {
    if (!modalTaskId) return;
    const task = tasks.find((t) => t.id === modalTaskId);
    setModalTask(task ?? null);
  }, [modalTaskId, tasks]);

  // -------------------------------------------------
  return (
    <div className={`${s.full_block} ${showExpanded ? s.showF : ""}`}>
      {idleModal && <IdleWarning onClose={() => setIdleModal(false)} />}

      {isExpanded && (
        <div
          className={`${s.overlay} ${showExpanded ? s.show : ""}`}
          onClick={toggleExpand}
        />
      )}

      <div
        className={`${s.wrapper} ${isExpanded ? s.expandedWrapper : ""
          } ${showExpanded ? s.show : ""}`}
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
          secondsMap={secondsMap} // только начальные значения, без постоянного обновления
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
        text={`Поставить активную задачу на паузу и переключиться на "${pendingTask?.title}"?`}
        onConfirm={pauseAndSwitchTask}
        onCancel={() => {
          setConfirmPause(false);
          setPendingTaskId(null);
        }}
      />

      {notifications.map((n) => (
        <TaskNotification
          key={n.id}
          {...n}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      <ModelWindow
        isOpen={!!modalTaskId}
        onClose={() => setModalTaskId(null)}
      >
        <TicketFormPage
          modal
          taskId={modalTaskId}
          activeTask={modalTask}
          startTask={startTask}
          clearActiveTask={clearActiveTask}
        />
      </ModelWindow>
    </div>
  );
};
