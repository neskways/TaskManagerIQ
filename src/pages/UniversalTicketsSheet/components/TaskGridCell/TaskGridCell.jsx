// TaskGridCell.jsx
import s from "./TaskGridCell.module.scss";
import { useState } from "react";
import { getStatusColor } from "../../../../modules/TaskStatuses";

// утилита: hex -> rgba
const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return null;
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

  // Берём цвет через хелпер — он умеет и код, и title
  const statusColor = getStatusColor(taskData.status) || "#95a5a6"; // fallback

  return (
    <>
      {cells.map((text, i) => {
        let extraClass = "";
        let style = {};

        if (i === 0) extraClass = s.first_column;
        else if (i === 1) extraClass = s.second_column;

        // колонка статуса (index 3)
        if (i === 3) {
          style = {
            backgroundColor: hexToRgba(statusColor, 0.1), // слабый фон
            color: statusColor,
            fontWeight: 600,
            borderRadius: 8,
            padding: "6px 10px",
            textAlign: "center",
            display: "inline-block",
            minWidth: 80,
          };
        }

        return (
          <div
            key={i}
            className={`${baseClass} ${extraClass}`}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
          >
            {/* если это статус — рендерим "пилл" с отдельным стилем */}
            {i === 3 ? <span style={style}>{text}</span> : <span>{text}</span>}
          </div>
        );
      })}
    </>
  );
};
