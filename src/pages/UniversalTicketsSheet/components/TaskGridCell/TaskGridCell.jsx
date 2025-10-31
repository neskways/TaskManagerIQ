import s from "./TaskGridCell.module.scss";
import { useState } from "react";

export const TaskGridCell = ({ taskData }) => {
  const [hovered, setHovered] = useState(false);

  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);

  const baseClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

  const cells = [
    taskData.number,
    taskData.title,
    taskData.client,
    taskData.status,
    taskData.executor,
    taskData.priority,
    taskData.timeSpent,
  ];

  return (
    <>
      {cells.map((text, i) => {
        let extraClass = "";
        if (i === 0) extraClass = s.first_column;
        else if (i === 1) extraClass = s.second_column;

        return (
          <div
            key={i}
            className={`${baseClass} ${extraClass}`}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            <span>{text}</span>
          </div>
        );
      })}
    </>
  );
};
