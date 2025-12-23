import s from "./TaskList.module.scss";
import { secToHHMMSS } from "../../../../../../utils/secToHHMMSS";

export const TaskList = ({
  tasks,
  secondsMap,
  selectedTaskId,
  isExpanded,
  loading,
  onSelectTask,
  onOpenModal,
}) => {
  return (
    <div className={`${s.listBox} ${isExpanded ? s.expanded : ""}`}>
      <div className={s.listInner}>
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
              onDoubleClick={() => onOpenModal(task.id)}
            >
              <div className={s.taskId}>{task.id}</div>
              <div className={s.taskTitle}>{task.title}</div>

              {isExpanded && (
                <div className={s.taskClient}>{task.client ?? "—"}</div>
              )}

              <div className={s.taskTime}>
                {secToHHMMSS(secondsMap[task.id] || 0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
