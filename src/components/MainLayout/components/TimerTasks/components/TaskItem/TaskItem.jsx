import { memo } from "react";
import s from "./TaskItem.module.scss";

export const TaskItem = memo(({
  task,
  selected,
  isExpanded,
  onSelect,
  onOpenModal,
}) => {
  return (
    <div
      className={`${s.taskItem} ${selected ? s.selected : ""}`}
      onClick={() => onSelect(task.id)}
      onDoubleClick={() => onOpenModal(task.id)}
    >
      <div className={s.taskId}>{task.id}</div>
      <div className={s.taskTitle}>{task.title}</div>

      {isExpanded && <div className={s.taskClient}>{task.client ?? "—"}</div>}
    </div>
  );
});
