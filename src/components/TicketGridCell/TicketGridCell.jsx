import s from "./TicketGridCell.module.scss";
import { useState } from "react";

export const TicketGridCell = ({ ticketData }) => {
  const [hovered, setHovered] = useState(false);

  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);

  const cellClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

  return (
    <>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.title}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.client}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.department}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.status}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.priority}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.timeSpent}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.createdBy}</span></div>
      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave}><span>{ticketData.createdAt}</span></div>
    </>
  );
};
