import s from "./TicketsTable.module.scss";
import { useEffect, useRef, useState } from "react";
import { headersTitleTickets } from "../../modules/Arrays";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { TicketGridCell } from "../TicketGridCell/TicketGridCell";

const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const defaultWidths = [25, 15, 10, 10, 10, 10, 10, 10];

const mockTickets = [
  {
    title: "Ошибка входа в 1С",
    client: "ООО Ромашка",
    department: "1С",
    status: "Открыт",
    priority: "Высокий",
    timeSpent: "01:20",
    createdBy: "Иванов И.И.",
    createdAt: "2025-06-10 14:32",
  },
  {
    title: "Не печатается отчёт",
    client: "ЗАО Тест",
    department: "СА",
    status: "В работе",
    priority: "Средний",
    timeSpent: "00:45",
    createdBy: "Петров П.П.",
    createdAt: "2025-06-12 09:10",
  },
  {
    title: "Ошибка базы данных",
    client: "ИП Сидоров",
    department: "1С",
    status: "Закрыт",
    priority: "Критичный",
    timeSpent: "02:10",
    createdBy: "Сидорова А.А.",
    createdAt: "2025-06-14 16:05",
  },
];

export const TicketsTable = () => {
  const [colWidths, setColWidths] = useState(() =>
    getFromLocalStorage(LOCAL_STORAGE_KEY_TICKETS, defaultWidths)
  );

  const startX = useRef(0);
  const tableRef = useRef(null);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);
  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");
  console.log(gridTemplateColumns)
  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY_TICKETS, colWidths);
  }, [colWidths]);

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    resizingColIndex.current = index;
    startWidths.current = [colWidths[index], colWidths[index + 1]];
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const dx = e.clientX - startX.current;
    const tableWidth = tableRef.current.offsetWidth;
    const deltaPercent = (dx / tableWidth) * 100;

    let left = startWidths.current[0] + deltaPercent;
    let right = startWidths.current[1] - deltaPercent;

    const minPercent = 5;
    if (left < minPercent || right < minPercent) return;

    const newWidths = [...colWidths];
    newWidths[resizingColIndex.current] = left;
    newWidths[resizingColIndex.current + 1] = right;

    setColWidths(newWidths);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
  <div className={s.gridTableWrapper}>
    <div
      ref={tableRef}
      className={s.gridTable}
      style={{ gridTemplateColumns }} // <-- обязательно!
    >
      {headersTitleTickets.map((header, i) => (
        <div key={i} className={s.gridHeader}>
          <span className={s.header_span}>{header}</span>
          {i < headersTitleTickets.length - 1 && (
            <div className={s.resizer} onMouseDown={(e) => handleMouseDown(e, i)} />
          )}
        </div>
      ))}

      {mockTickets.map((ticket, index) => (
        <TicketGridCell key={index} ticketData={ticket} />
      ))}
    </div>
  </div>
);

};
