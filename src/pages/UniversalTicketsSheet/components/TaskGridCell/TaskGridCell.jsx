import s from "./TaskGridCell.module.scss";
import { useState } from "react";

const statusStylesByTitle = {
  "Новая": { bg: "#e8f3ff", color: "#007bff" },
  "На оценке": { bg: "#f3e9ff", color: "#8e44ad" },
  "Передана на выполнение": { bg: "#e9f2ff", color: "#2980b9" },
  "Выполняется": { bg: "#fff7e0", color: "#e67e22" },
  "Приостановлена": { bg: "#fff0e0", color: "#d35400" },
  "Готова к сдаче": { bg: "#e8f9e9", color: "#27ae60" },
  "Завершена": { bg: "#e5f8f4", color: "#16a085" },
  "Отменена/Не актуальна": { bg: "#fdecea", color: "#c0392b" },
};

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
