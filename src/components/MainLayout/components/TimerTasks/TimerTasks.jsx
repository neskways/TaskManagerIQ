// TimerTasks.jsx
import s from "./TimerTasks.module.scss";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { TaskList } from "./components/TaskList/TaskList";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { TaskNotification } from "./components/TaskNotification/TaskNotification";
import { useTaskNotifications } from "./hooks/useTaskNotifications";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { usePopup } from "../../../../context/PopupContext";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";
import { useTaskAudio } from "../../../../hooks/useTaskAudio";
import { useTasks } from "./hooks/useTasks";
import { useIdleTimer } from "./hooks/useIdleTimer";
import { taskStatuses } from "../../../../modules/taskStatuses";

const EXPAND_ANIMATION_MS = 0;
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

  useIdleTimer(() => setIdleModal(true), 300000, activeTaskId, idleModal);

  /* =======================
     Restore last selected task from cookies
  ======================= */
  useEffect(() => {
    const lastSelectedId = Cookies.get(COOKIE_LAST_SELECTED);
    let taskToSelect = null;

    if (activeTaskId) {
      // если есть активная задача, выбираем её
      taskToSelect = activeTaskId;
    } else if (lastSelectedId) {
      // если есть сохранённая последняя задача и она есть в списке, выбираем её
      const found = tasks.find((t) => t.id === Number(lastSelectedId));
      if (found) taskToSelect = found.id;
    }

    if (taskToSelect) {
      setSelectedTaskId(taskToSelect);
    }
  }, [tasks, activeTaskId]);

  const selectedTask =
    tasks.find((t) => t.id === selectedTaskId) ?? null;

  /* =======================
     Expand toggle
  ======================= */
  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => setShowExpanded(true), 10);
    } else {
      setShowExpanded(false);
      setTimeout(() => setIsExpanded(false), EXPAND_ANIMATION_MS);
    }
  };

  /* =======================
     Task selection
  ======================= */
  const onSelectTask = (taskId) => {
    Cookies.set(COOKIE_LAST_SELECTED, taskId, { expires: 30 }); // сохраняем на 30 дней
    if (activeTaskId && activeTaskId !== taskId) {
      setPendingTaskId(taskId);
      setConfirmPause(true);
    } else {
      setSelectedTaskId(taskId);
    }
  };

  /* =======================
     Pause confirmation
  ======================= */
  const handlePauseConfirm = async () => {
    const task = tasks.find((t) => t.id === activeTaskId);
    await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);

    if (task) {
      addNotification(
        `Задача "${task.title}" поставлена на паузу`,
        "info",
        3000
      );
    }

    setActiveTaskId(null);
    setSelectedTaskId(pendingTaskId);
    setConfirmPause(false);
  };

  /* =======================
     Start / Pause task
  ======================= */
  const startPauseTask = async () => {
    if (!selectedTaskId) return;

    const selectedTaskObj = tasks.find((t) => t.id === selectedTaskId);

    if (activeTaskId === selectedTaskId) {
      await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);

      if (selectedTaskObj) {
        addNotification(
          `Задача "${selectedTaskObj.title}" поставлена на паузу`,
          "info",
          3000
        );
      }

      setActiveTaskId(null);
    } else {
      if (activeTaskId) {
        const activeTaskObj = tasks.find((t) => t.id === activeTaskId);

        await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);

        if (activeTaskObj) {
          addNotification(
            `Задача "${activeTaskObj.title}" поставлена на паузу`,
            "info",
            3000
          );
        }
      }

      await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);

      if (selectedTaskObj) {
        addNotification(
          `Задача "${selectedTaskObj.title}" запущена`,
          "success",
          5000
        );
      }

      setActiveTaskId(selectedTaskId);
    }
  };

  /* =======================
     Finish button click
  ======================= */
  const handleFinishClick = () => {
    if (!activeTaskId) {
      showPopup(
        "Нет запущенной задачи, чтобы завершить",
        "warning"
      );
      return;
    }

    const task = tasks.find((t) => t.id === activeTaskId);
    setTaskToFinish(task);
    setConfirmFinish(true);
  };

  /* =======================
     Finish task confirm
  ======================= */
  const finishTask = async () => {
    if (!taskToFinish) return;

    await manageTaskState(taskToFinish.id, taskStatuses.READY.code);

    addNotification(
      `Задача "${taskToFinish.title}" завершена`,
      "success",
      5000
    );

    setActiveTaskId(null);
    setTaskToFinish(null);
    setConfirmFinish(false);
  };

  return (
    <div className={`${s.full_block} ${showExpanded ? s.showF : ""}`}>
      {idleModal && <IdleWarning onClose={() => setIdleModal(false)} />}

      {isExpanded && (
        <div
          className={`${s.overlay} ${showExpanded ? s.show : ""}`}
          onClick={handleToggleExpand}
        />
      )}

      <div
        className={`${s.wrapper} ${
          isExpanded ? s.expandedWrapper : ""
        } ${showExpanded ? s.show : ""}`}
      >
        <ExpandButton expanded={isExpanded} onToggle={handleToggleExpand} />

        <TimerHeader
          selectedTask={selectedTask}
          isRunning={activeTaskId === selectedTaskId}
          displaySec={selectedTask ? secondsMap[selectedTaskId] : 0}
          onStartPause={startPauseTask}
          onFinish={handleFinishClick}
          isExpanded={isExpanded}
        />

        <TaskList
          tasks={tasks}
          secondsMap={secondsMap}
          selectedTaskId={selectedTaskId}
          loading={false}
          isExpanded={isExpanded}
          onSelectTask={onSelectTask}
          onOpenModal={setModalTaskId}
        />
      </div>

      {/* Confirm finish task */}
      <PopupConfirm
        isOpen={confirmFinish}
        text={
          taskToFinish
            ? `Завершить "${taskToFinish.title}"?`
            : "Завершить задачу?"
        }
        onConfirm={finishTask}
        onCancel={() => setConfirmFinish(false)}
      />

      {/* Confirm pause active task */}
      <PopupConfirm
        isOpen={confirmPause}
        text="Поставить активную задачу на паузу?"
        onConfirm={handlePauseConfirm}
        onCancel={() => setConfirmPause(false)}
      />

      {/* Notifications */}
      {notifications.map((n) => (
        <TaskNotification
          key={n.id}
          message={n.message}
          type={n.type}
          duration={n.duration}
          onClose={() => removeNotification(n.id)}
        />
      ))}

      {/* Modal */}
      <ModelWindow
        isPadding={false}
        isOpen={!!modalTaskId}
        onClose={() => setModalTaskId(null)}
      >
        <TicketFormPage modal taskId={modalTaskId} />
      </ModelWindow>
    </div>
  );
};
