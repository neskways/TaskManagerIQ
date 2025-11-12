import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import s from "./TimerTasks.module.scss";

const REFRESH_INTERVAL_MS = 15000;

const secToHHMMSS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
};

const formatTaskId = (id) => String(id).padStart(9, "0");

export const TimerTasks = () => {
  const { showPopup } = usePopup();
  const navigate = useNavigate();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [secondsMap, setSecondsMap] = useState({});

  const timerRef = useRef(null);
  const pollingRef = useRef(null);

  // 📥 Загрузка задач
  const loadTasks = async () => {
    try {
      const state = [
        taskStatuses.PAUSED.code,
        taskStatuses.IN_PROGRESS.code,
        taskStatuses.TRANSFERRED.code,
      ];
      const data = await getTaskQueue(state);
      const now = Date.now();
      const secs = {};

      data.forEach((t) => {
        if (t.state === taskStatuses.IN_PROGRESS.title && t.lastUpdate) {
          const elapsed = Math.floor((now - new Date(t.lastUpdate)) / 1000);
          secs[t.id] = (t.displaySec || 0) + elapsed;
        } else {
          secs[t.id] = t.displaySec || 0;
        }
      });

      setTasks(data);
      setSecondsMap(secs);

      const running = data.find(
        (t) => t.state === taskStatuses.IN_PROGRESS.title
      );
      if (running) {
        setActiveTaskId((prev) => (prev !== running.id ? running.id : prev));
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setSelectedTaskId((prev) => prev || data[0].id);
        setActiveTaskId(null);
      }
    } catch (err) {
      showPopup("Не удалось загрузить задачи.", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Периодическая загрузка
  useEffect(() => {
    loadTasks();
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  // ⏱️ Таймер
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

  // ⚙️ Управление состоянием задачи
  const manageTaskState = async (taskId, newState) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const formattedTaskId = formatTaskId(taskId);
      await curentTaskManage(formattedTaskId, newState);
      await loadTasks();

      if (newState === taskStatuses.IN_PROGRESS.code) {
        showPopup(`Задача "${task.title}" запущена`, { type: "info" });
      } else if (newState === taskStatuses.PAUSED.code) {
        showPopup(`Задача "${task.title}" поставлена на паузу`, {
          type: "info",
        });
      } else if (newState === taskStatuses.READY.code) {
        showPopup(`Задача "${task.title}" завершена`, { type: "info" });
      }
    } catch (err) {
      showPopup("Не удалось обновить задачу.", { type: "error" });
      throw err;
    }
  };

  // ▶ / ⏸ Старт и пауза
  const startPauseTask = async () => {
    if (!selectedTaskId) {
      showPopup("Выберите задачу для запуска.", { type: "info" });
      return;
    }

    if (activeTaskId === selectedTaskId) {
      try {
        await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
        setActiveTaskId(null);
      } catch {}
    } else {
      try {
        if (activeTaskId) {
          await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
        }
        await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
        setActiveTaskId(selectedTaskId);
      } catch {}
    }
  };

  const handleFinishClick = () => {
  if (!selectedTaskId) {
    showPopup("Сначала выберите задачу для завершения.", { type: "info" });
    return;
  }

  const task = tasks.find((t) => t.id === selectedTaskId);
  if (!task) return;

  if (task.state !== taskStatuses.IN_PROGRESS.title) {
    showPopup(
      'Завершить можно только задачу в статусе "Выполняется".',
      { type: "info" }
    );
    return;
  }

  setConfirmOpen(true);
}

  const finishTask = async () => {
    if (!selectedTaskId) return;
    try {
      await manageTaskState(selectedTaskId, taskStatuses.READY.code);
      if (activeTaskId === selectedTaskId) setActiveTaskId(null);
    } catch {}
  };

  // 📌 Выбор задачи
  const onSelectTask = (taskId) => {
    if (taskId === selectedTaskId) return;
    if (activeTaskId && activeTaskId !== taskId) {
      manageTaskState(activeTaskId, taskStatuses.PAUSED.code).then(() => {
        setActiveTaskId(null);
      });
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

            <div className={s.sectionHeader}>Текущая задача</div>

            <div className={s.taskTitleCenter}>
              {selectedTask ? selectedTask.title : "Нет выбранной задачи"}
            </div>

            <div className={s.bottomRow}>
              <div className={s.controls}>
                <button
                  className={s.btn}
                  onClick={startPauseTask}
                  disabled={loading}
                >
                  {isRunning ? "⏸ Пауза" : "▶ Старт"}
                </button>
                <button
                  className={s.btnEnd}
                  onClick={handleFinishClick}
                  disabled={loading}
                >
                  ⏹ Завершить
                </button>
              </div>

              <div className={s.timerBig}>{secToHHMMSS(displaySec)}</div>
            </div>
          </div>
        </div>

        <div className={s.listBox}>
          <div className={s.listInner}>
            {loading && tasks.length === 0 && (
              <div className={s.empty}>Загрузка...</div>
            )}
            {!loading && tasks.length === 0 && (
              <div className={s.empty}>Задач нет</div>
            )}

            <div className={s.items}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`${s.taskItem} ${
                    task.id === selectedTaskId ? s.selected : ""
                  }`}
                  onClick={() => onSelectTask(task.id)}
                  onDoubleClick={() => navigate(`/ticket/${task.id}`)}
                >
                  <div className={s.taskTitle}>
                    {task.id} |
                  </div>
                  <div className={s.taskTitle}>
                    {task.title}
                  </div>
                  <div className={s.taskTime}>
                    | {secToHHMMSS(secondsMap[task.id] || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PopupConfirm
        isOpen={confirmOpen}
        text={
          selectedTask
            ? `Завершить задачу "${selectedTask.title}"?`
            : "Вы уверены, что хотите завершить задачу?"
        }
        onConfirm={() => {
          setConfirmOpen(false);
          finishTask();
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {isExpanded && (
        <div className={s.overlay} onClick={() => setIsExpanded(false)} />
      )}
    </>
  );
};
