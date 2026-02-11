import { memo, useEffect, useState } from "react";
import s from "./TimerHeader.module.scss";
import { secToHHMMSS } from "../../../../../../utils/secToHHMMSS";

export const TimerHeader = memo(({
  selectedTask,
  isRunning,
  displaySec,
  onStartPause,
  onFinish,
  isExpanded,
}) => {
  const [localSec, setLocalSec] = useState(displaySec);

  // синхронизация при смене выбранной задачи или обновлении секунд
  useEffect(() => {
    setLocalSec(displaySec);
  }, [displaySec]);

  // локальный таймер
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLocalSec((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className={`${s.headerBox} ${isExpanded ? s.expanded : ""}`}>
      <div className={s.headerInner}>
        <div className={s.sectionHeader}>Текущая задача</div>

        <div className={s.taskTitleCenter}>
          {selectedTask?.title ?? "Нет задачи"}
        </div>

        <div className={s.bottomRow}>
          <div className={s.controls}>
            <button className={s.btn} onClick={onStartPause}>
              {isRunning ? "⏸ Пауза" : "▶ Старт"}
            </button>
            <button className={s.btnEnd} onClick={onFinish}>
              ⏹ Завершить
            </button>
          </div>

          <div className={s.timerBig}>{secToHHMMSS(localSec)}</div>
        </div>
      </div>
    </div>
  );
});
