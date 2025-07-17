import s from "./TicketGridCell.module.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

export const TicketGridCell = ({ ticketData }) => {
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
    ticketData.title,
    ticketData.client,
    ticketData.department,
    ticketData.status,
    ticketData.priority,
    ticketData.timeSpent,
    ticketData.createdBy,
    ticketData.createdAt,
  ];

  return (
    <>
      {cells.map((text, i) => (
        <Link
          to={`/ticket_form/${ticketData.id}`}
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
