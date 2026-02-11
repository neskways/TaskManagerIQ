import s from "./TaskList.module.scss";
import { memo } from "react";
import { TaskItem } from "../TaskItem/TaskItem";

export const TaskList = memo(({
  tasks,
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
            <TaskItem
              key={task.id}
              task={task}
              selected={task.id === selectedTaskId}
              isExpanded={isExpanded}
              onSelect={onSelectTask}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
