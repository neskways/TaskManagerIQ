import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import s from "./TimerTasks.module.scss";

const REFRESH_INTERVAL_MS = 15000;

// Формат секунд в HH:MM:SS
const secToHHMMSS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const formatTaskId = (id) => String(id).padStart(9, "0");

export const TimerTasks = () => {
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [secondsMap, setSecondsMap] = useState({});

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const prevTasksRef = useRef([]);

  const tasksAreEqual = (a, b) => {
    if (a.length !== b.length) return false;
    return a.every((task, i) => {
      const t = b[i];
      return task.id === t.id && task.state === t.state && task.displaySec === t.displaySec;
    });
  };

  const loadTasks = async () => {
    try {
      const state = [
        taskStatuses.PAUSED.code,
        taskStatuses.IN_PROGRESS.code,
        taskStatuses.TRANSFERRED.code,
      ];
      const data = await getTaskQueue(state);

      if (tasksAreEqual(prevTasksRef.current, data)) {
        setLoading(false);
        return;
      }

      const secs = {};
      data.forEach((t) => {
        secs[t.id] = secondsMap[t.id] || t.displaySec || 0;
      });

      setTasks(data);
      setSecondsMap(secs);
      prevTasksRef.current = data;

      const running = data.find((t) => t.state === taskStatuses.IN_PROGRESS.title);
      if (running) {
        if (activeTaskId !== running.id) setActiveTaskId(running.id);
        if (!selectedTaskId) setSelectedTaskId(running.id);
      } else {
        if (!activeTaskId) setActiveTaskId(null);
        if (!selectedTaskId && data.length > 0) setSelectedTaskId(data[0].id);
      }
    } catch (err) {
      showPopup("Не удалось загрузить задачи.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

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

  const manageTaskState = async (taskId, newState) => {
    try {
      const formattedTaskId = formatTaskId(taskId);
      await curentTaskManage(formattedTaskId, newState);
      await loadTasks();

      // Попапы для действий
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      if (newState === taskStatuses.IN_PROGRESS.code) {
        showPopup(`Задача "${task.title}" запущена`, { type: "info" });
      } else if (newState === taskStatuses.PAUSED.code) {
        showPopup(`Задача "${task.title}" поставлена на паузу`, { type: "info" });
      } else if (newState === taskStatuses.READY.code) {
        showPopup(`Задача "${task.title}" завершена`, { type: "info" });
      }
    } catch (err) {
      showPopup("Не удалось обновить задачу.", { type: "error" });
    }
  };

  const startPauseTask = () => {
    if (!selectedTaskId) return;

    if (activeTaskId === selectedTaskId) {
      manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
    } else {
      // Ставим текущую активную задачу на паузу
      if (activeTaskId) {
        manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      }
      manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
      setActiveTaskId(selectedTaskId);
    }
  };

  const finishTask = () => {
    if (!selectedTaskId) return;
    manageTaskState(selectedTaskId, taskStatuses.READY.code);
    if (activeTaskId === selectedTaskId) setActiveTaskId(null);
  };

  const onSelectTask = (taskId) => {
    if (taskId === selectedTaskId) return;

    if (activeTaskId && activeTaskId !== taskId) {
      manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
    }

    setSelectedTaskId(taskId);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const displaySec = selectedTask ? secondsMap[selectedTaskId] || 0 : 0;
  const isRunning = activeTaskId === selectedTaskId;

  return (
    <>
      <div className={`${s.wrapper} ${isExpanded ? s.expanded : ""}`}>
        <button
          className={s.expandIcon}
          onClick={() => setIsExpanded((v) => !v)}
          title={isExpanded ? "Свернуть" : "Развернуть"}
        >
          {isExpanded ? "🗗" : "🗖"}
        </button>

        <div className={s.headerBox}>
          <div className={s.headerInner}>
            <div className={s.controls}>
              <button className={s.btn} onClick={startPauseTask} disabled={!selectedTaskId}>
                {isRunning ? "⏸ Пауза" : "▶ Старт"}
              </button>
              <button className={s.btnEnd} onClick={finishTask} disabled={!selectedTaskId}>
                ⏹ Завершить
              </button>
            </div>

            <div className={s.timerAndTitle}>
              <div className={s.titleText}>{selectedTask ? selectedTask.title : "Нет выбранной задачи"}</div>
              <div className={s.timerBig}>{secToHHMMSS(displaySec)}</div>
            </div>
          </div>
        </div>

        <div className={s.listBox}>
          <div className={s.listInner}>
            {loading && tasks.length === 0 && <div className={s.empty}>Загрузка...</div>}
            {!loading && tasks.length === 0 && <div className={s.empty}>Задач нет</div>}

            <div className={s.items}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`${s.taskItem} ${task.id === selectedTaskId ? s.selected : ""}`}
                  onClick={() => onSelectTask(task.id)}
                  onDoubleClick={() => navigate(`/ticket/${task.id}`)}
                >
                  <div className={s.taskTitle} title={task.title}>{task.title}</div>
                  <div className={s.taskTime}>{secToHHMMSS(secondsMap[task.id] || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isExpanded && <div className={s.overlay} onClick={() => setIsExpanded(false)} />}
    </>
  );
};
