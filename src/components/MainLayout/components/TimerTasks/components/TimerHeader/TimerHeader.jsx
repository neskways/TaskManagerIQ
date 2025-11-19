import s from "./TimerHeader.module.scss";
import { secToHHMMSS } from "../../../../../../utils/secToHHMMSS";

export const TimerHeader = ({
  selectedTask,
  isRunning,
  displaySec,
  onStartPause,
  onFinish,
}) => {
  return (
    <div className={s.headerBox}>
      <div className={s.headerInner}>
        <div className={s.sectionHeader}>Текущая задача</div>

        <div className={s.taskTitleCenter}>
          {selectedTask ? selectedTask.title : "Нет задачи"}
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
};
