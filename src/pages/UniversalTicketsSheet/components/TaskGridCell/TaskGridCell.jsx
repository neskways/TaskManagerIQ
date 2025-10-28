import s from "./TaskGridCell.module.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

export const TaskGridCell = ({ taskData }) => {
  const [hovered, setHovered] = useState(false);

  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);

  const cellClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

  const cellProps = {
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    className: cellClass,
  };

  const cells = [
    taskData.title,
    taskData.client,
    taskData.department,
    taskData.status,
    taskData.priority,
    taskData.timeSpent,
    taskData.createdBy,
    taskData.createdAt,
  ];

  return (
    <>
      {cells.map((text, i) => (
        <Link
          to={`/ticket_form/${taskData.id}`}
          {...cellProps}
          key={i}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <span>{text}</span>
        </Link>
      ))}
    </>
  );
};
