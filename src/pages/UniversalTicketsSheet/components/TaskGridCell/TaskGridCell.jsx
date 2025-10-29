import s from "./TaskGridCell.module.scss";
import { useState } from "react";

export const TaskGridCell = ({ taskData }) => {
  const [hovered, setHovered] = useState(false);
  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);
  const cellClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

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
      {cells.map((text, i) => (
        <div
          key={i}
          className={cellClass}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <span>{text}</span>
        </div>
      ))}
    </>
  );
};
