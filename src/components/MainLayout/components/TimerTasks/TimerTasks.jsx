import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { TaskList } from "./components/TaskList/TaskList";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { ModelWindow } from "../../../../components/ModelWindow/ModelWindow";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";

import s from "./TimerTasks.module.scss";

const REFRESH_INTERVAL_MS = 12000; // обновление задач каждые 12 секунд
const IDLE_TIMEOUT_MS = 600000; // 10 минут

export const TimerTasks = () => {
  const { showPopup } = usePopup();

  const [tasks, setTasks] = useState([]);
  const [secondsMap, setSecondsMap] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState(null);

  const [modalTaskId, setModalTaskId] = useState(null);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const prevTaskIdsRef = useRef(new Set());
  const isFirstLoad = useRef(true);

  const [idleModal, setIdleModal] = useState(false);
  const idleRef = useRef(null);

  // ----------------------------
  //  Загрузка задач
  // ----------------------------
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
        if (t.state === taskStatuses.IN_PROGRESS.title && t.lastUpdate) {
          const elapsed = Math.floor((now - new Date(t.lastUpdate)) / 1000);
          sec[t.id] = (t.displaySec || 0) + elapsed;
        } else {
          sec[t.id] = t.displaySec || 0;
        }
      });

      // обнаруживаем новые задачи
      const newIds = new Set(data.map((t) => t.id));

      if (!isFirstLoad.current) {
        const prev = prevTaskIdsRef.current;
        const hasNew = [...newIds].some((id) => !prev.has(id));
        if (hasNew) playNewTaskSound();
      } else {
        isFirstLoad.current = false;
      }

      prevTaskIdsRef.current = newIds;

      setTasks(data);
      setSecondsMap(sec);

      const running = data.find((t) => t.state === taskStatuses.IN_PROGRESS.title);

      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setSelectedTaskId((prev) => prev || data[0].id);
        setActiveTaskId(null);
      }
    } catch (err) {
      showPopup("Не удалось загрузить задачи", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const playNewTaskSound = () => {
    const codeUser = Cookies.get("codeUser") || "000000002";
    const audio = new Audio(`/sounds/${codeUser}.mp3`);
    audio.volume = 0.5;

    audio.play().catch(() => {
      const fallback = new Audio("/sounds/000000002.mp3");
      fallback.volume = 0.5;
      fallback.play();
    });
  };

  // ----------------------------
  //  Начальная загрузка и опрос
  // ----------------------------
  useEffect(() => {
    loadTasks();
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  // ----------------------------
  //  Таймер текущей задачи
  // ----------------------------
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

  // ----------------------------
  //  Управление задачей
  // ----------------------------
  const manageTaskState = async (id, newState) => {
    const t = tasks.find((e) => e.id === id);
    if (!t) return;

    try {
      await curentTaskManage(String(id).padStart(9, "0"), newState);
      await loadTasks();

      const msg =
        newState === taskStatuses.IN_PROGRESS.code
          ? `Задача "${t.title}" запущена`
          : newState === taskStatuses.PAUSED.code
          ? `Пауза: "${t.title}"`
          : newState === taskStatuses.READY.code
          ? `Завершено: "${t.title}"`
          : "";

      if (msg) showPopup(msg, { type: "info" });
    } catch {
      showPopup("Ошибка изменения статуса", { type: "error" });
    }
  };

  const startPauseTask = async () => {
    if (!selectedTaskId) return;
    if (activeTaskId === selectedTaskId) {
      await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
      return;
    }

    if (activeTaskId) {
      await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
    }

    await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
    setActiveTaskId(selectedTaskId);
  };

  const handleFinish = () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;

    if (task.state !== taskStatuses.IN_PROGRESS.title) {
      showPopup("Завершить можно только выполняющуюся задачу", { type: "info" });
      return;
    }

    setConfirmFinish(true);
  };

  const finishTask = async () => {
    await manageTaskState(selectedTaskId, taskStatuses.READY.code);
    if (activeTaskId === selectedTaskId) setActiveTaskId(null);
  };

  const onSelectTask = (taskId) => {
    if (activeTaskId && activeTaskId !== taskId) {
      setPendingTaskId(taskId);
      setConfirmSwitch(true);
      return;
    }
    setSelectedTaskId(taskId);
  };

  const confirmSwitchTask = async () => {
    await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
    setActiveTaskId(null);
    setSelectedTaskId(pendingTaskId);

    setPendingTaskId(null);
    setConfirmSwitch(false);
  };

  // ----------------------------
  //  Таймер простоя
  // ----------------------------
  const resetIdle = () => {
    clearTimeout(idleRef.current);
    if (idleModal) return;
    if (activeTaskId) return;

    idleRef.current = setTimeout(() => {
      setIdleModal(true);
    }, IDLE_TIMEOUT_MS);
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

  // ----------------------------
  //  Рендер
  // ----------------------------
  return (
    <>
      {idleModal && <IdleWarning onClose={() => setIdleModal(false)} />}

      <div className={`${s.wrapper} ${isExpanded ? s.expanded : ""}`}>
        <ExpandButton expanded={isExpanded} onToggle={() => setIsExpanded(!isExpanded)} />

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
          loading={loading}
          isExpanded={isExpanded}
          onSelectTask={onSelectTask}
          onOpenModal={setModalTaskId}
        />
      </div>

      <PopupConfirm
        isOpen={confirmFinish}
        text={selectedTask ? `Завершить "${selectedTask.title}"?` : "Завершить задачу?"}
        onConfirm={() => {
          setConfirmFinish(false);
          finishTask();
        }}
        onCancel={() => setConfirmFinish(false)}
      />

      <PopupConfirm
        isOpen={confirmSwitch}
        text={`Поставить текущую задачу на паузу и переключиться?`}
        onConfirm={confirmSwitchTask}
        onCancel={() => setConfirmSwitch(false)}
      />

      <ModelWindow isOpen={!!modalTaskId} onClose={() => setModalTaskId(null)} isPadding={false}>
        <TicketFormPage modal taskId={modalTaskId} onClose={() => setModalTaskId(null)} />
      </ModelWindow>
    </>
  );
};
