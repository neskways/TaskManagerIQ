import s from "./TasksTable.module.scss";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { MESSAGES } from "../../../../modules/messages";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";
import { SidebarFilter } from "../SidebarFilter/SidebarFilter";
import { getTasksList } from "../../../../api/get/getTasksList";
import { headersTitleTask } from "./TitlesForTables";

const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const DEFAULT_WIDTHS = [5, 33, 14, 16, 11, 8, 7, 7];

const formatDate = (value) => {
  if (!value) return "";
  return value.split(" ")[0] || value;
};

const secToHHMMSS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(s).padStart(2, "0")}`;
};

export const TasksTable = ({ queryParams, onOpenTask, refetchKey, isTaskOpen }) => {
  const { showPopup } = usePopup();
  const userCode = Cookies.get("userCode");

  const [colWidths, setColWidths] = useState(
    () =>
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) ||
      DEFAULT_WIDTHS
  );

  const [showFilter, setShowFilter] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);        // первая загрузка
  const [silentLoading, setSilentLoading] = useState(false); // тихое обновление

  const tableRef = useRef(null);
  const startX = useRef(0);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);

  const gridTemplateColumns = colWidths
    .map((w) => `minmax(40px, ${w}%)`)
    .join(" ");

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(colWidths));
  }, [colWidths]);

  const loadTasks = async (silent = false) => {
    if (!silent) setLoading(true);
    else setSilentLoading(true);

    try {
      const data = await getTasksList(
        queryParams.states,
        queryParams.userCode,
        queryParams.firstline
      );

      const mapped = data.map((item) => ({
        number: parseInt(item.number, 10),
        title: item.title,
        client: item.client,
        status: item.status,
        executor: item.executor,
        createdDate: formatDate(item.createdDate),
        priority: item.priority,
        timeSpent: secToHHMMSS(item.timeSpent),
      }));

      setTasks(mapped);
    } catch (err) {
      console.error("Ошибка при загрузке задач:", err);
      if (err.response?.status !== 401) {
        showPopup(MESSAGES.loadTaskError, { type: "error" });
      }
    } finally {
      setLoading(false);
      setSilentLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(false);
  }, []);

  useEffect(() => {
    if (refetchKey === null || refetchKey === undefined) return;
    loadTasks(true); // тихое обновление
  }, [refetchKey]);

  useEffect(() => {
    // Если модалка открыта — обновление выключено
    if (isTaskOpen) return;

    const interval = setInterval(() => {
      loadTasks(true); // тихое обновление
    }, 3000);

    return () => clearInterval(interval);
  }, [isTaskOpen, queryParams]);

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
    <div className={s.wrapper}>
      <div className={s.btn_wrapper}>
        <button className={s.filter_btn} onClick={() => setShowFilter(true)}>
          Фильтр
        </button>
      </div>

      <div className={s.gridTableWrapper}>
        <div className={s.gridHeaderRow} style={{ gridTemplateColumns }}>
          {headersTitleTask.map((header, i) => (
            <div key={i} className={s.gridHeader}>
              <span>
                {header}
                {i === 1 &&
                  tasks.length > 0 &&
                  (userCode === "000000005"
                    ? ` 卐 ${tasks.length} 卐`
                    : `〔 ${tasks.length} 〕`)}
              </span>

              {i < headersTitleTask.length - 1 && (
                <div
                  className={s.resizer}
                  onMouseDown={(e) => handleMouseDown(e, i)}
                />
              )}
            </div>
          ))}
        </div>

        <div className={s.gridBody} ref={tableRef}>
          {tasks.map((task, index) => (
            <div
              key={index}
              className={s.gridRow}
              style={{ gridTemplateColumns }}
              onClick={() => onOpenTask(task.number)}
            >
              <TaskGridCell taskData={task} />
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${s.overlay} ${showFilter ? s.show : ""}`}
        onClick={() => setShowFilter(false)}
      />

      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />
    </div>
  );
};
