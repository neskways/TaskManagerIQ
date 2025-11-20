import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { TaskList } from "./components/TaskList/TaskList";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { IdleWarning } from "./components/IdleWarning/IdleWarning";
import { TimerHeader } from "./components/TimerHeader/TimerHeader";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { ExpandButton } from "./components/ExpandButton/ExpandButton";

import s from "./TimerTasks.module.scss";

const REFRESH_INTERVAL_MS = 15000;
const REFRESH_INTERVAL_MS_5 = 5000;
const IDLE_TIMEOUT_MS = 600000;

export const TimerTasks = () => {
  const { showPopup } = usePopup();

  const [tasks, setTasks] = useState([]);
  const [secondsMap, setSecondsMap] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false); // для анимации
  const [idleModal, setIdleModal] = useState(false);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const prevTaskIdsRef = useRef(new Set());
  const idleRef = useRef(null);
  const isFirstLoad = useRef(true);

  const userCode = Cookies.get("userCode");

  // Загрузка задач
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

      const newIds = new Set(data.map((t) => t.id));
      if (!isFirstLoad.current) {
        const prev = prevTaskIdsRef.current;
        const hasNew = [...newIds].some((id) => !prev.has(id));
        if (hasNew) playNewTaskSound();
      } else isFirstLoad.current = false;

      prevTaskIdsRef.current = newIds;
      setTasks(data);

      const running = data.find((t) => t.state === taskStatuses.IN_PROGRESS.name);
      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setSelectedTaskId((prev) => prev || data[0].id);
        setActiveTaskId(null);
      }

      setSecondsMap(sec);
    } catch {
      showPopup("Не удалось загрузить задачи", { type: "error" });
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

  // Первичная загрузка и опрос задач
  useEffect(() => {
    loadTasks();
    const intervalTime = userCode === "000000002" ? REFRESH_INTERVAL_MS_5 : REFRESH_INTERVAL_MS;
    pollingRef.current = setInterval(loadTasks, intervalTime);
    return () => clearInterval(pollingRef.current);
  }, []);

  // Таймер активной задачи
  useEffect(() => {
    if (!activeTaskId) return;
    timerRef.current = setInterval(() => {
      setSecondsMap((prev) => ({ ...prev, [activeTaskId]: (prev[activeTaskId] || 0) + 1 }));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeTaskId]);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => setShowExpanded(true), 10); // запускаем анимацию
    } else {
      setShowExpanded(false);
      setIsExpanded(false); // закрытие мгновенное
    }
  };

  // Логика бездействия
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
    <div className={s.full_block}>
      {idleModal && <IdleWarning onClose={() => setIdleModal(false)} />}

      {isExpanded && (
        <div className={`${s.overlay} ${showExpanded ? s.show : ""}`} onClick={handleToggleExpand} />
      )}

      <div className={`${s.wrapper} ${isExpanded ? s.expandedWrapper : ""} ${showExpanded ? s.show : ""}`}>
        <ExpandButton expanded={isExpanded} onToggle={handleToggleExpand} />

        <TimerHeader
          selectedTask={selectedTask}
          isRunning={activeTaskId === selectedTaskId}
          displaySec={selectedTask ? secondsMap[selectedTaskId] : 0}
          onStartPause={() => {}}
          onFinish={() => {}}
        />

        <TaskList
          tasks={tasks}
          secondsMap={secondsMap}
          selectedTaskId={selectedTaskId}
          loading={false} // всегда показываем
          isExpanded={isExpanded}
          onSelectTask={() => {}}
          onOpenModal={() => {}}
        />
      </div>
    </div>
  );
};
