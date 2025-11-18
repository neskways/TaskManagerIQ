import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../../../../context/PopupContext";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { PopupConfirm } from "../../../../UI/PopupConfirm/PopupConfirm";
import { TicketFormPage } from "../../../../pages/TicketFormPage/TicketFormPage";
import s from "./TimerTasks.module.scss";

const REFRESH_INTERVAL_MS = 12000;

const secToHHMMSS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
};

const formatTaskId = (id) => String(id).padStart(9, "0");

export const TimerTasks = () => {
  const { showPopup } = usePopup();
  const navigate = useNavigate();

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

  // -------------------------------
  // ЗАГРУЗКА СПИСКА ЗАДАЧ
  // -------------------------------
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

      // проверка на новые задачи → звук
      const newTaskIds = new Set(data.map((t) => t.id));
      if (!isFirstLoad.current) {
        const prevIds = prevTaskIdsRef.current;
        const hasNew = [...newTaskIds].some((id) => !prevIds.has(id));
        if (hasNew) playNewTaskSound();
      } else {
        isFirstLoad.current = false;
      }

      prevTaskIdsRef.current = newTaskIds;

      setTasks(data);
      setSecondsMap(secs);

      // определить активную задачу
      const running = data.find(
        (t) => t.state === taskStatuses.IN_PROGRESS.title
      );

      if (running) {
        setActiveTaskId((prev) =>
          prev !== running.id ? running.id : prev
        );
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

  const playNewTaskSound = () => {
    try {
      const codeUser = Cookies.get("codeUser") || "000000002";
      const audio = new Audio(`/sounds/${codeUser}.mp3`);
      audio.volume = 0.5;

      audio.play().catch(() => {
        const fallback = new Audio("/sounds/000000002.mp3");
        fallback.volume = 0.5;
        fallback.play().catch(() => {});
      });
    } catch (_) {}
  };

  // -------------------------------
  // ПЕРВИЧНАЯ ЗАГРУЗКА + ПОЛЛИНГ
  // -------------------------------
  useEffect(() => {
    loadTasks();
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  // -------------------------------
  // ТАЙМЕР ДЛЯ АКТИВНОЙ ЗАДАЧИ
  // -------------------------------
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

  // -------------------------------
  // УПРАВЛЕНИЕ СТАТУСАМИ
  // -------------------------------
  const manageTaskState = async (taskId, newState) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const formattedId = formatTaskId(taskId);
      await curentTaskManage(formattedId, newState);
      await loadTasks();

      if (newState === taskStatuses.IN_PROGRESS.code)
        showPopup(`Задача "${task.title}" запущена`, { type: "info" });
      if (newState === taskStatuses.PAUSED.code)
        showPopup(`Задача "${task.title}" поставлена на паузу`, {
          type: "info",
        });
      if (newState === taskStatuses.READY.code)
        showPopup(`Задача "${task.title}" завершена`, { type: "info" });
    } catch (_) {
      showPopup("Не удалось обновить задачу.", { type: "error" });
      throw _;
    }
  };

  // старт / пауза
  const startPauseTask = async () => {
    if (!selectedTaskId) {
      showPopup("Выберите задачу.", { type: "info" });
      return;
    }

    if (activeTaskId === selectedTaskId) {
      await manageTaskState(selectedTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
      return;
    }

    try {
      if (activeTaskId) {
        await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      }
      await manageTaskState(selectedTaskId, taskStatuses.IN_PROGRESS.code);
      setActiveTaskId(selectedTaskId);
    } catch {}
  };

  const handleFinishClick = () => {
    const task = tasks.find((t) => t.id === selectedTaskId);
    if (!task) return;

    if (task.state !== taskStatuses.IN_PROGRESS.title) {
      showPopup("Завершить можно только задачу 'Выполняется'.", {
        type: "info",
      });
      return;
    }

    setConfirmFinish(true);
  };

  const finishTask = async () => {
    try {
      await manageTaskState(selectedTaskId, taskStatuses.READY.code);
      if (activeTaskId === selectedTaskId) setActiveTaskId(null);
    } catch {}
  };

  // -------------------------------
  // ВЫБОР ЗАДАЧИ (с подтверждением переключения)
  // -------------------------------
  const onSelectTask = (taskId) => {
    if (taskId === selectedTaskId) return;

    if (activeTaskId && activeTaskId !== taskId) {
      setPendingTaskId(taskId);
      setConfirmSwitch(true);
      return;
    }

    setSelectedTaskId(taskId);
  };

  const confirmSwitchTask = async () => {
    try {
      await manageTaskState(activeTaskId, taskStatuses.PAUSED.code);
      setActiveTaskId(null);
      setSelectedTaskId(pendingTaskId);
    } catch {
      showPopup("Не удалось переключить.", { type: "error" });
    } finally {
      setConfirmSwitch(false);
      setPendingTaskId(null);
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const displaySec = selectedTask ? secondsMap[selectedTaskId] || 0 : 0;
  const isRunning = activeTaskId === selectedTaskId;

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <>
      <div className={`${s.wrapper} ${isExpanded ? s.expanded : ""}`}>
        <button
          className={s.expandIcon}
          onClick={() => setIsExpanded((v) => !v)}
        >
          {isExpanded ? "🗗" : "🗖"}
        </button>

        <div className={s.headerBox}>
          <div className={s.headerInner}>
            <div className={s.sectionHeader}>Текущая задача</div>

            <div className={s.taskTitleCenter}>
              {selectedTask ? selectedTask.title : "Нет задачи"}
            </div>

            <div className={s.bottomRow}>
              <div className={s.controls}>
                <button className={s.btn} onClick={startPauseTask}>
                  {isRunning ? "⏸ Пауза" : "▶ Старт"}
                </button>
                <button className={s.btnEnd} onClick={handleFinishClick}>
                  ⏹ Завершить
                </button>
              </div>

              <div className={s.timerBig}>{secToHHMMSS(displaySec)}</div>
            </div>
          </div>
        </div>

        {/* ------- СПИСОК -------- */}

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
                  onDoubleClick={() => setModalTaskId(task.id)}
                >
                  <div className={s.taskId}>{task.id}</div>
                  <div className={s.taskTitle}>{task.title}</div>

                  {isExpanded && (
                    <div className={s.taskClient}>
                      {task.client ?? "—"}
                    </div>
                  )}

                  <div className={s.taskTime}>
                    {secToHHMMSS(secondsMap[task.id] || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------
          Подтверждение завершения
      ------------------------- */}
      <PopupConfirm
        isOpen={confirmFinish}
        text={
          selectedTask
            ? `Завершить "${selectedTask.title}"?`
            : "Завершить задачу?"
        }
        onConfirm={() => {
          setConfirmFinish(false);
          finishTask();
        }}
        onCancel={() => setConfirmFinish(false)}
      />

      {/* -------------------------
          Подтверждение переключения
      ------------------------- */}
      <PopupConfirm
        isOpen={confirmSwitch}
        text={
          activeTaskId
            ? `Задача "${tasks.find((t) => t.id === activeTaskId)?.title}" сейчас выполняется.
Поставить её на паузу и переключиться?`
            : "Переключиться?"
        }
        onConfirm={confirmSwitchTask}
        onCancel={() => {
          setConfirmSwitch(false);
          setPendingTaskId(null);
        }}
      />

      {/* -------------------------
          МОДАЛЬНОЕ ОКНО ЗАЯВКИ
      ------------------------- */}
      {modalTaskId && (
        <div className={s.modalOverlay}>
          <div className={s.modalWindow}>
            <TicketFormPage
              modal={true}
              taskId={modalTaskId}
              onClose={() => setModalTaskId(null)}
            />
          </div>
        </div>
      )}

      {/* Оверлей при expand */}
      {isExpanded && (
        <div className={s.overlay} onClick={() => setIsExpanded(false)} />
      )}
    </>
  );
};
