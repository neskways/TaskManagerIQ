// src/components/TimerTasks/TimerTasks.jsx
import { useEffect, useState, useRef } from "react";
import s from "./TimerTasks.module.scss";
import { getTaskQueue } from "../../../../api/get/getTaskQueue";
import { api } from "../../../../api/axios"; // если у тебя другой путь — поправь
import { usePopup } from "../../../../context/PopupContext";
import { format } from "date-fns";

/**
 * Компонент отображает шапку (левая часть) + список (правая часть)
 * Высота шапки и списка — 120px, layout 50/50
 *
 * Обновление данных — каждые 5 секунд
 *
 * Замечание: при ошибке 401 axios-interceptor уже вызовет popup + logout + navigate,
 * поэтому в catch показываем popup только если ошибка !== 401
 */

const REFRESH_INTERVAL_MS = 5000;

const secToMMSS = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const TimerTasks = () => {
  const { showPopup } = usePopup();

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // отображаемая (выбрана) задача
  const [activeTaskId, setActiveTaskId] = useState(null); // задача в состоянии "Выполняется"
  const [loading, setLoading] = useState(true);

  const pollingRef = useRef(null);

  const load = async () => {
    try {
      const data = await getTaskQueue();
      setTasks(data);

      // устанавливаем activeTaskId по данным сервера: если есть state === 'Выполняется' (или 'Running')
      const running = data.find(
        (t) =>
          String(t.state).toLowerCase() === "выполняется" ||
          String(t.state).toLowerCase() === "running" ||
          String(t.state).toLowerCase() === "inprogress"
      );
      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId(running.id);
      } else {
        setActiveTaskId(null);
        // если ничего не выполняется — выбираем самую приоритетную (первую в списке)
        if (data.length > 0) {
          setSelectedTaskId((prev) => prev ?? data[0].id);
        } else {
          setSelectedTaskId(null);
        }
      }
    } catch (err) {
      // axios interceptor уже обрабатывает 401: popup + logout + navigate
      if (err?.response?.status !== 401) {
        showPopup("Не удалось загрузить список задач.", { type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    pollingRef.current = setInterval(() => {
      load();
    }, REFRESH_INTERVAL_MS);

    return () => {
      clearInterval(pollingRef.current);
    };
  }, []);

  // === API действия: старт / пауза / завершение ===
  // Подставь реальные эндпоинты и пейлоады если у тебя другие
  const startTask = async (taskId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/StartTask`, { Token: undefined, id: taskId });
      // перезагрузим список сразу
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось запустить задачу.", {type: "error" });
      }
    }
  };

  const pauseTask = async (taskId) => {
    try {
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/PauseTask`, { Token: undefined, id: taskId });
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось приостановить задачу.", { type: "error" });
      }
    }
  };

  const finishTask = async (taskId) => {
    try {
      // Сначала делаем pause на сервере (если нужно), затем finish
      await api.post(`${import.meta.env.VITE_API_BASE_URL}/FinishTask`, { Token: undefined, id: taskId });
      await load();
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось завершить задачу.", { type: "error" });
      }
    }
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? null;

  // отображаемое время (сервер даёт displaySec в getTaskQueue)
  const displaySec = selectedTask ? selectedTask.displaySec : 0;
  const displayMin = Math.floor(displaySec / 60);

  return (
    <div className={s.wrapper}>
      <div className={s.headerBox}>
        <div className={s.headerInner}>
          <div className={s.controls}>
            {/* Кнопки: если выбрана активная задача (выполняется) показываем соответствующие состояния */}
            {activeTaskId === selectedTaskId ? (
              <>
                <button className={s.btn} onClick={() => pauseTask(activeTaskId)}>⏸ Пауза</button>
                <button className={s.btn} onClick={() => { /* можно скрыть старт */ }}>▶ Старт</button>
              </>
            ) : (
              <>
                <button className={s.btn} onClick={() => startTask(selectedTaskId)}>▶ Старт</button>
                <button className={s.btn} disabled>⏸ Пауза</button>
              </>
            )}

            <button
              className={s.btnEnd}
              onClick={() => {
                if (selectedTaskId) finishTask(selectedTaskId);
              }}
              disabled={!selectedTaskId}
            >
              Завершить
            </button>
          </div>

          <div className={s.timerAndTitle}>
            <div className={s.timerBig}>{secToMMSS(displaySec)}</div>
            <div className={s.titleRow}>
              <div className={s.titleText}>
                {selectedTask ? selectedTask.title : "Нет выбранной задачи"}
              </div>
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
                className={`${s.taskItem} ${task.id === selectedTaskId ? s.selected : ""} ${task.id === activeTaskId ? s.running : ""}`}
                onClick={() => setSelectedTaskId(task.id)}
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
  );
};
