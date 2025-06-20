import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Импортируем useNavigate для перенаправления
import s from "./ClientGridCell.module.scss";

export const ClientGridCell = ({ clientData, setSelectedClient }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate(); 

  const onEnter = () => setHovered(true);
  const onLeave = () => setHovered(false);

  const cellClass = hovered ? `${s.gridCell} ${s.hovered}` : s.gridCell;

  const handleClick = () => {
    setSelectedClient(clientData);
    
    const clientId = clientData.Code; 

    navigate(`/ticket/all_open?clientId=${clientId}`);
  };
  console.log(clientData)

  return (
    <>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className={cellClass} onClick={() => setSelectedClient(clientData)}>
        {clientData.Name}
      </div>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className={cellClass} onClick={() => setSelectedClient(clientData)}>
        {clientData.Priority}
      </div>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className={cellClass} onClick={() => setSelectedClient(clientData)}>
        {clientData.Activities[0]?.Fee}
      </div>
      <div onMouseEnter={onEnter} onMouseLeave={onLeave} className={cellClass} onClick={() => setSelectedClient(clientData)}>
        {clientData.Activities[1]?.Fee}
      </div>

      <div className={cellClass} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={() => setSelectedClient(clientData)}>{1}</div>

      <div 
        className={cellClass} 
        onMouseEnter={onEnter} 
        onMouseLeave={onLeave} 
        onClick={handleClick} 
      >
        {6}
      </div>
    </>
  );
};
