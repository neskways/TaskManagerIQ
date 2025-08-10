import { useEffect, useRef, useState } from "react";
import s from "./TasksTable.module.scss";
import { headersTitleTickets } from "../../modules/Arrays";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";

const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const DEFAULT_WIDTHS = [25, 15, 10, 10, 10, 10, 10, 10];

const mockTickets = [
  {
    id: 31,
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
    id: 32,
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
    id: 33,
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


export const TasksTable = ({ showFilter }) => {
  const [colWidths, setColWidths] = useState(() =>
    getFromLocalStorage(LOCAL_STORAGE_KEY_TICKETS, DEFAULT_WIDTHS)
  );

  const tableRef = useRef(null);
  const startX = useRef(0);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);

  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

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
    if (!isResizing.current || !tableRef.current) return;

    const dx = e.clientX - startX.current;
    const tableWidth = tableRef.current.offsetWidth;
    const deltaPercent = (dx / tableWidth) * 100;

    let left = startWidths.current[0] + deltaPercent;
    let right = startWidths.current[1] - deltaPercent;
    const MIN_WIDTH = 5;

    if (left < MIN_WIDTH || right < MIN_WIDTH) return;

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
    <div className={`${s.gridTableWrapper} ${showFilter ? s.active : ''}`}>
      <div
        ref={tableRef}
        className={s.gridTable}
        style={{ gridTemplateColumns }}
      >
        {headersTitleTickets.map((header, index) => (
          <div key={index} className={s.gridHeader}>
            <span className={s.header_span}>{header}</span>
            {index < headersTitleTickets.length - 1 && (
              <div
                className={s.resizer}
                onMouseDown={(e) => handleMouseDown(e, index)}
              />
            )}
          </div>
        ))}

        {mockTickets.map((task, index) => (
          <TaskGridCell key={index} taskData={task} />
        ))}
      </div>
    </div>
  );
};
