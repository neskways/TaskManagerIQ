import s from "./TasksTable.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Loading } from "../../../../UI/Loading/Loading";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";
import { getTasksList } from "../../../../api/get/getTasksList";
import { headersTitleTickets } from "../../../../modules/TitlesForTables";

const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const DEFAULT_WIDTHS = [5, 30, 20, 10, 13, 12, 10]; // 7 колонок

export const TasksTable = ({ setShowFilter }) => {
  const navigate = useNavigate();

  const [colWidths, setColWidths] = useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) ||
      DEFAULT_WIDTHS
  );
  const tableRef = useRef(null);
  const startX = useRef(0);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(colWidths));
  }, [colWidths]);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const states = ["000000003", "000000004"]
        const data = await getTasksList(states);
        const mapped = data.map((item) => ({
          number: parseInt(item.number, 10),
          title: item.title,
          client: item.client,
          status: item.status,
          executor: item.executor,
          priority: item.priority,
          timeSpent: item.timeSpent,
        }));
        setTasks(mapped);
      } catch (err) {
        console.error("Ошибка при загрузке задач:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

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

  if (loading) {
    return (
      <div className={s.centerWrapper}>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className={s.btn_wrapper}>
        <button
          className={s.filter_btn}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Фильтр
        </button>
      </div>

      <div className={s.gridTableWrapper}>
        {/* 🔹 Фиксированная шапка */}
        <div className={s.gridHeaderRow} style={{ gridTemplateColumns }}>
          {headersTitleTickets.map((header, i) => (
            <div key={i} className={s.gridHeader}>
              <span>{header}</span>
              {i < headersTitleTickets.length - 1 && (
                <div
                  className={s.resizer}
                  onMouseDown={(e) => handleMouseDown(e, i)}
                />
              )}
            </div>
          ))}
        </div>

        {/* 🔹 Скроллируемое тело */}
        <div className={s.gridBody} ref={tableRef}>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={s.gridRow}
              style={{ gridTemplateColumns }}
              onClick={() => navigate(`/ticket/${task.number}`)}
            >
              <TaskGridCell taskData={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
