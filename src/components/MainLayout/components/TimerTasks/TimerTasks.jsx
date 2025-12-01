import s from "./TimerTasks.module.scss";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { TaskList } from "./components/TaskList/TaskList";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";


const REFRESH_INTERVAL_MS = 15000;
const REFRESH_INTERVAL_MS_5 = 10000;
const IDLE_TIMEOUT_MS = 300000;

export const TimerTasks = () => {
  const { showPopup } = usePopup();

  const [tasks, setTasks] = useState([]);
  const [secondsMap, setSecondsMap] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [modalTaskId, setModalTaskId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);
  const [idleModal, setIdleModal] = useState(false);

  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmPause, setConfirmPause] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState(null);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const prevTaskIdsRef = useRef(new Set());
  const idleRef = useRef(null);

  const userCode = Cookies.get("userCode");

  const loadTasks = async () => {
    try {
      const states = [
        taskStatuses.PAUSED.code,
        taskStatuses.IN_PROGRESS.code,
        taskStatuses.TRANSFERRED.code,
      ];

      const data = await getTaskQueue(states);
      const now = Date.now();
      const sec = {};

      data.forEach((t) => {
        if (t.state === taskStatuses.IN_PROGRESS.name && t.startedAt) {
          const elapsed = Math.floor((now - new Date(t.startedAt)) / 1000);
          sec[t.id] = (t.displaySec || 0) + elapsed;
        } else {
          sec[t.id] = t.displaySec || 0;
        }
      });

      prevTaskIdsRef.current = new Set(data.map((t) => t.id));
      setTasks(data);

      const running = data.find(
        (t) => t.state === taskStatuses.IN_PROGRESS.name
      );
      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setSelectedTaskId((prev) => prev || data[0].id);
        setActiveTaskId(null);
      }

      setSecondsMap(sec);
    } catch (err) {
      console.error(err);
      showPopup("Не удалось загрузить задачи", { type: "error" });
    }
  };

  useEffect(() => {
    loadTasks();
    const intervalTime =
      userCode === "000000002" ? REFRESH_INTERVAL_MS_5 : REFRESH_INTERVAL_MS;
    pollingRef.current = setInterval(loadTasks, intervalTime);
    return () => clearInterval(pollingRef.current);
  }, []);

  // Таймер активной задачи
  useEffect(() => {
    if (!activeTaskId) return;
    timerRef.current = setInterval(() => {
      setSecondsMap((prev) => ({
        ...prev,
        [activeTaskId]: (prev[activeTaskId] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeTaskId]);

  const manageTaskState = async (id, newState) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      await curentTaskManage(String(id).padStart(9, "0"), newState);
      await loadTasks();
      const msg =
        newState === taskStatuses.IN_PROGRESS.code
          ? `Задача "${task.title}" запущена`
          : newState === taskStatuses.PAUSED.code
          ? `Пауза: "${task.title}"`
          : newState === taskStatuses.READY.code
          ? `Завершено: "${task.title}"`
          : "";
      if (msg) showPopup(msg, { type: "info" });
    } catch {
      showPopup("Ошибка изменения статуса", { type: "error" });
    }
  };

  const onSelectTask = (taskId) => {
    if (activeTaskId && activeTaskId !== taskId) {
      // есть активная задача, спрашиваем подтверждение
      setPendingTaskId(taskId);
      setConfirmPause(true);
    } else {
      setSelectedTaskId(taskId);
    }
  };

  const handlePauseConfirm = async () => {
    // ставим на паузу активную
    await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
    setActiveTaskId(null);
    // выбираем новую задачу
    setSelectedTaskId(pendingTaskId);
    setPendingTaskId(null);
    setConfirmPause(false);
  };

  const startPauseTask = async () => {
    if (!selectedTaskId) return;

    const selectedTask = tasks.find((t) => t.id === selectedTaskId);
    if (!selectedTask) return;

    if (activeTaskId === selectedTaskId) {
      // Ставим на паузу активную задачу
      await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
      // Оставляем выбранную задачу в шапке
      setSelectedTaskId(selectedTaskId);
    } else {
      // Если активной задачи нет или это другая задача, запускаем выбранную
      if (activeTaskId) {
        await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      }
      await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
      setActiveTaskId(selectedTaskId);
      setSelectedTaskId(selectedTaskId);
    }
  };

  const handleFinish = () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;
    if (task.state !== taskStatuses.IN_PROGRESS.name) {
      showPopup("Завершить можно только выполняющуюся задачу", {
        type: "info",
      });
      return;
    }
    setConfirmFinish(true);
  };

  const finishTask = async () => {
    await manageTaskState(selectedTaskId, taskStatuses.READY.code);
    if (activeTaskId === selectedTaskId) setActiveTaskId(null);
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => setShowExpanded(true), 10);
    } else {
      setShowExpanded(false);
      setIsExpanded(false);
    }
  };

  const resetIdle = () => {
    clearTimeout(idleRef.current);
    if (idleModal || activeTaskId) return;
    idleRef.current = setTimeout(() => setIdleModal(true), IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    const handleActivity = () => resetIdle();
    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimeout(idleRef.current);
    };
  }, [activeTaskId, idleModal]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

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
        className={`${s.wrapper} ${isExpanded ? s.expandedWrapper : ""} ${
          showExpanded ? s.show : ""
        }`}
      >
        <ExpandButton expanded={isExpanded} onToggle={handleToggleExpand} />

        <TimerHeader
          selectedTask={selectedTask}
          isRunning={activeTaskId === selectedTaskId}
          displaySec={selectedTask ? secondsMap[selectedTaskId] : 0}
          onStartPause={startPauseTask}
          onFinish={handleFinish}
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

      <PopupConfirm
        isOpen={confirmFinish}
        text={
          selectedTask
            ? `Завершить задачу "${selectedTask.title}"?`
            : "Завершить задачу?"
        }
        onConfirm={() => {
          setConfirmFinish(false);
          finishTask();
        }}
        onCancel={() => setConfirmFinish(false)}
      />

      <PopupConfirm
        isOpen={confirmPause}
        text={
          tasks.find((t) => t.id === activeTaskId)?.title
            ? `Вы уверены, что хотите поставить на паузу задачу "${
                tasks.find((t) => t.id === activeTaskId).title
              }"?`
            : "Поставить на паузу активную задачу?"
        }
        onConfirm={handlePauseConfirm}
        onCancel={() => {
          setConfirmPause(false);
          setPendingTaskId(null);
        }}
      />

      <ModelWindow isPadding={false} isOpen={!!modalTaskId} onClose={() => setModalTaskId(null)}>
        <TicketFormPage
          modal
          taskId={modalTaskId}
          onClose={() => setModalTaskId(null)}
        />
      </ModelWindow>
    </div>
  );
};
