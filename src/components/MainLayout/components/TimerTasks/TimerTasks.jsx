import { useState, useEffect } from "react";
import s from "./TimerTasks.module.scss";

export const TimerTasks = () => {
  // Пример задач (будет имитация загрузки)
  const [tasks, setTasks] = useState([
    { id: 1, title: "Сверстать главную страницу", trackedSeconds: 0, runningSince: null },
    { id: 2, title: "Написать API для задач", trackedSeconds: 0, runningSince: null },
    { id: 3, title: "Почистить стили", trackedSeconds: 0, runningSince: null },
  ]);

  const [currentTaskId, setCurrentTaskId] = useState(1);

  // ====== Вспомогательные функции ======
  const getTask = (id) => tasks.find((t) => t.id === id);
  const currentTask = getTask(currentTaskId);

  const isRunning = currentTask?.runningSince !== null;

  // Считаем сколько секунд показывать
  const getDisplaySeconds = (task) => {
    if (!task) return 0;
    const base = task.trackedSeconds;
    if (!task.runningSince) return base;
    const delta = Math.floor((Date.now() - task.runningSince) / 1000);
    return base + delta;
  };

  // Преобразуем секунды в HH:MM:SS
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ====== Управление ======
  const toggleTimer = () => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === currentTaskId) {
          if (task.runningSince) {
            // остановить
            const delta = Math.floor((Date.now() - task.runningSince) / 1000);
            return { ...task, trackedSeconds: task.trackedSeconds + delta, runningSince: null };
          } else {
            // запустить
            return { ...task, runningSince: Date.now() };
          }
        }
        return task;
      })
    );
  };

  const switchTask = (id) => {
    // Останавливаем текущую
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === currentTaskId && task.runningSince) {
          const delta = Math.floor((Date.now() - task.runningSince) / 1000);
          return { ...task, trackedSeconds: task.trackedSeconds + delta, runningSince: null };
        }
        return task;
      })
    );

    setCurrentTaskId(id);

    // Запускаем новую задачу
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return { ...task, runningSince: Date.now() };
        }
        return task;
      })
    );
  };

  const createTask = (title) => {
    const newId = tasks.length + 1;
    const newTask = { id: newId, title, trackedSeconds: 0, runningSince: Date.now() };
    // Остановим текущую
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === currentTaskId && task.runningSince) {
          const delta = Math.floor((Date.now() - task.runningSince) / 1000);
          return { ...task, trackedSeconds: task.trackedSeconds + delta, runningSince: null };
        }
        return task;
      })
    );
    // Добавляем новую и делаем её активной
    setTasks((prev) => [...prev, newTask]);
    setCurrentTaskId(newId);
  };

  // ====== Обновляем UI каждую секунду ======
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.timer_wrapper}>
      <div className={s.current_task}>
        <button onClick={toggleTimer} className={s.btn}>
          {isRunning ? "⏸ Пауза" : "▶ Старт"}
        </button>
        <div className={s.time_display}>{formatTime(getDisplaySeconds(currentTask))}</div>
      
        <div className={s.task_title}>{currentTask?.title || "Нет задачи"}</div>
        </div>

      <div className={s.task_list}>
        {tasks.map((task) => (
          <div key={task.id} className={s.task_item}>
            <span title={task.title}>{task.title}</span>
            <span>{formatTime(getDisplaySeconds(task))}</span>
            {task.id !== currentTaskId && (
              <button onClick={() => switchTask(task.id)}>Выбрать</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
