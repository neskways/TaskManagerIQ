import s from "./TaskGridCell.module.scss";
import { useState } from "react";
import { statusStylesByTitle } from "../../../../modules/taskStatuses";

export const TaskGridCell = ({ taskData }) => {
  const [hovered, setHovered] = useState(false);

  const baseClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

  const cells = [
    taskData.number,
    taskData.title,
    taskData.client,
    taskData.status,
    taskData.executor,
    taskData.priority,
    taskData.timeSpent,
    taskData.createdDate,       
  ];

  return (
    <>
      {cells.map((text, i) => {
        let extraClass = "";
        if (i === 0) extraClass = s.first_column;
        if (i === 1) extraClass = s.second_column;

        const isStatus = i === 3;
        const style = statusStylesByTitle[text];

        return (
          <div
            key={i}
            className={`${baseClass} ${extraClass}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {isStatus && style ? (
              <span
                style={{
                  backgroundColor: style.bg,
                  color: style.color,
                  fontWeight: 600,
                  borderRadius: "10px",
                  padding: "4px 10px",
                  display: "inline-block",
                  minWidth: 90,
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                  whiteSpace: "nowrap",
                }}
              >
                {text}
              </span>
            ) : (
              <span>{text}</span>
            )}
          </div>
        );
      })}
    </>
  );
};
