import { useEffect, useState, useRef } from "react";
import s from "./TimerTasks.module.scss";
import { api } from "../../../../api/axios";
import { useNavigate } from "react-router-dom"; 
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";

const REFRESH_INTERVAL_MS = 5000;

const secToMMSS = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const TimerTasks = () => {
  const { showPopup } = usePopup();
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const pollingRef = useRef(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const data = await getTaskQueue();
      setTasks(data);

      const running = data.find(
        (t) =>
          ["выполняется", "running", "inprogress"].includes(
            String(t.state).toLowerCase()
          )
      );

      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId(running.id);
      } else {
        setActiveTaskId(null);
        if (data.length > 0) {
          setSelectedTaskId((prev) => prev ?? data[0].id);
        } else {
          setSelectedTaskId(null);
        }
      }
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось загрузить список задач.", { type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    pollingRef.current = setInterval(() => load(), REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  const startTask = async (taskId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/StartTask`, {
        Token: undefined,
        id: taskId,
      });
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось запустить задачу.", { type: "error" });
      }
    }
  };

  const pauseTask = async (taskId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/PauseTask`, {
        Token: undefined,
        id: taskId,
      });
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось приостановить задачу.", { type: "error" });
      }
    }
  };

  const finishTask = async (taskId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/FinishTask`, {
        Token: undefined,
        id: taskId,
      });
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось завершить задачу.", { type: "error" });
      }
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const displaySec = selectedTask ? selectedTask.displaySec : 0;
  const isRunning = activeTaskId === selectedTaskId;

  return (
    <>
      <div className={`${s.wrapper} ${isExpanded ? s.expanded : ""}`}>
        {/* Кнопка разворота (в углу) */}
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
              <button
                className={s.btn}
                onClick={() =>
                  isRunning
                    ? pauseTask(activeTaskId)
                    : startTask(selectedTaskId)
                }
                disabled={!selectedTaskId}
              >
                {isRunning ? "⏸ Пауза" : "▶ Старт"}
              </button>

              <button
                className={s.btnEnd}
                onClick={() => selectedTaskId && finishTask(selectedTaskId)}
                disabled={!selectedTaskId}
              >
                ⏹ Завершить
              </button>
            </div>

            <div className={s.timerAndTitle}>
              <div className={s.timerBig}>{secToMMSS(displaySec)}</div>
              <div className={s.titleText}>
                {selectedTask ? selectedTask.title : "Нет выбранной задачи"}
              </div>
            </div>
          </div>
        </div>

        <div className={s.listBox}>
        <div className={s.listInner}>
          {loading && <div className={s.empty}>Загрузка...</div>}
          {!loading && tasks.length === 0 && <div className={s.empty}>Задач нет</div>}

          <div className={s.items}>
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`${s.taskItem} 
                            ${task.id === selectedTaskId ? s.selected : ""} 
                            ${task.id === activeTaskId ? s.running : ""}`}
                onClick={() => setSelectedTaskId(task.id)}
                onDoubleClick={() => navigate(`/ticket/${task.id}`)} 
              >
                <div className={s.taskTitle} title={task.title}>
                  {task.title}
                </div>
                <div className={s.taskTime}>
                  {Math.floor(task.displaySec / 60)} мин
                </div>
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
