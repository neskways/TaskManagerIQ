import s from "./TasksTable.module.scss";
import Cookies from "js-cookie";
import { useEffect, useRef, useState, useMemo } from "react";
import { headersTitleTask } from "./TitlesForTables";
import { MESSAGES } from "../../../../modules/messages";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";
import { getTasksList } from "../../../../api/get/getTasksList";

const REFRESH_INTERVAL_MS = 30000;
const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const DEFAULT_WIDTHS = [5, 33, 14, 16, 11, 8, 7, 7];

export const TasksTable = ({
  queryParams,
  selectedStatuses = [],
  selectedEmployees = [],
  selectedClient = null,
  onOpenTask,
  refetchKey,
  isTaskOpen,
  onShowFilter
}) => {
  const { showPopup } = usePopup();
  const userCode = Cookies.get("userCode");

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [colWidths, setColWidths] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) || DEFAULT_WIDTHS
  );

  const [rawTasks, setRawTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const tableRef = useRef(null);
  const startX = useRef(0);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);
  const pollingRef = useRef(null);
  const openedFromUrlRef = useRef(false);

  const gridTemplateColumns = colWidths.map((w) => `minmax(40px, ${w}%)`).join(" ");

  const keyMap = [
    "number",
    "title",
    "client",
    "status",
    "executor",
    "priority",
    "timeSpent",
    "createdDate",
  ];

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TICKETS, JSON.stringify(colWidths));
  }, [colWidths]);

  const loadTasks = async () => {
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
        createdDate: item.createdDate?.split(" ")[0] || "",
        priority: item.priority,
        timeSpent: item.timeSpent, // храним число для сортировки
        timeSpentFormatted: `${String(Math.floor(item.timeSpent / 3600)).padStart(2, "0")}:${String(
          Math.floor((item.timeSpent % 3600) / 60)
        ).padStart(2, "0")}:${String(item.timeSpent % 60).padStart(2, "0")}`,
      }));

      setRawTasks(mapped);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        showPopup(MESSAGES.loadTaskError, { type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);
  useEffect(() => { if (refetchKey != null) loadTasks(); }, [refetchKey]);

  useEffect(() => {
    if (isTaskOpen) return;
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, [isTaskOpen, userCode, queryParams]);

  useEffect(() => {
    const filtered = rawTasks.filter((t) => {
      const statusOk =
        selectedStatuses.length ? selectedStatuses.includes(t.status) : true;
      const employeeOk =
        selectedEmployees.length ? selectedEmployees.includes(t.executor) : true;

      const clientName =
        typeof selectedClient === "string"
          ? selectedClient
          : selectedClient?.name;

      const clientOk = clientName
        ? t.client.toLowerCase().includes(clientName.toLowerCase())
        : true;

      return statusOk && employeeOk && clientOk;
    });

    setTasks(filtered);
  }, [selectedStatuses, selectedEmployees, selectedClient, rawTasks]);

  // 🔥 СОРТИРОВКА
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return tasks;

    return [...tasks].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // спец для времени
      if (sortConfig.key === "timeSpent") {
        valA = a.timeSpent;
        valB = b.timeSpent;
      }

      const emptyA = valA === null || valA === undefined || valA === "";
      const emptyB = valB === null || valB === undefined || valB === "";

      if (emptyA && emptyB) return 0;
      if (emptyA) return 1;
      if (emptyB) return -1;

      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      const bothNumbers = !isNaN(numA) && !isNaN(numB);

      if (bothNumbers) {
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortConfig]);

  const handleHeaderClick = (index) => {
    const key = keyMap[index];
    if (!key) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortArrow = (index) => {
    return sortConfig.key === keyMap[index]
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : null;
  };

  if (loading && !rawTasks.length)
    return (
      <div className={s.centerWrapper}>
        <Loading />
      </div>
    );

  return (
    <div className={s.wrapper}>
      <div className={s.btn_wrapper}>
        <button className={s.filter_btn} onClick={onShowFilter}>
          Фильтр
        </button>
      </div>

      <div className={s.gridTableWrapper}>
        <div className={s.gridHeaderRow} style={{ gridTemplateColumns }}>
          {headersTitleTask.map((header, i) => (
            <div
              key={i}
              className={s.gridHeader}
              onClick={() => handleHeaderClick(i)}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              <span>
                {header}
                <span className={s.sortArrow}>{getSortArrow(i)}</span>
                {header === "Заголовок" && sortedTasks.length
                  ? `〔 ${sortedTasks.length} 〕`
                  : ""}
              </span>
            </div>
          ))}
        </div>

        <div className={s.gridBody} ref={tableRef}>
          {sortedTasks.map((task) => (
            <div
              key={task.number}
              className={s.gridRow}
              style={{ gridTemplateColumns }}
              onClick={() => onOpenTask(task.number)}
            >
              <TaskGridCell
                taskData={{
                  ...task,
                  timeSpent: task.timeSpentFormatted,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
