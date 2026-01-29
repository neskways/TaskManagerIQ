import s from "./TimerHeader.module.scss";
import { secToHHMMSS } from "../../../../../../utils/secToHHMMSS";
import { memo } from "react";

export const TimerHeader = memo(({
  selectedTask,
  isRunning,
  displaySec,
  onStartPause,
  onFinish,
  isExpanded,
}) => {
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

          <div className={s.timerBig}>{secToHHMMSS(displaySec)}</div>
        </div>
      </div>
    </div>
  );
});
