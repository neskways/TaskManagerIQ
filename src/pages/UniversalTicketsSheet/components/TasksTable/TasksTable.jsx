import s from "./TasksTable.module.scss";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { headersTitleTask } from "./TitlesForTables";
import { MESSAGES } from "../../../../modules/messages";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";
import { getTasksList } from "../../../../api/get/getTasksList";

const REFRESH_INTERVAL_MS = 20000;
const REFRESH_INTERVAL_MS_5 = 10000;
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

  // ref чтобы открыть только один раз из URL
  const openedFromUrlRef = useRef(false);

  const gridTemplateColumns = colWidths.map((w) => `minmax(40px, ${w}%)`).join(" ");

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
        timeSpent: `${String(Math.floor(item.timeSpent / 3600)).padStart(2, "0")}:${String(
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

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (refetchKey != null) loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchKey]);

  useEffect(() => {
    if (isTaskOpen) return;

    if (pollingRef.current) clearInterval(pollingRef.current);

    const intervalTime =
      userCode === "000000002" ? REFRESH_INTERVAL_MS_5 : REFRESH_INTERVAL_MS;

    pollingRef.current = setInterval(loadTasks, intervalTime);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
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

  useEffect(() => {
    if (openedFromUrlRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const openParam = params.get("open");
    if (!openParam) return;

    const num = parseInt(openParam, 10);
    if (Number.isNaN(num)) return;

    // ищем в rawTasks (приоритет — потому что rawTasks — полный список)
    const inRaw = rawTasks.some((t) => t.number === num);
    const inTasks = tasks.some((t) => t.number === num);

    if (inRaw || inTasks) {
      openedFromUrlRef.current = true;
      try {
        onOpenTask(num);
      } catch (e) {
        console.error("onOpenTask error:", e);
      }

      // Удаляем параметр open из URL, чтобы не сработало повторно
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete("open");
        // сохраняем без параметра
        window.history.replaceState(null, "", url.toString());
      } catch (e) {
        const rawUrl = window.location.href.replace(/[?&]open=[^&]*/i, "");
        window.history.replaceState(null, "", rawUrl);
      }
    }
    // проверяем, когда rawTasks или tasks изменятся
  }, [rawTasks, tasks, onOpenTask]);

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
    const deltaPercent = (dx / tableRef.current.offsetWidth) * 100;

    let left = startWidths.current[0] + deltaPercent;
    let right = startWidths.current[1] - deltaPercent;

    if (left < 5 || right < 5) return;

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
        <div
          className={s.gridHeaderRow}
          style={{ gridTemplateColumns }}
        >
          {headersTitleTask.map((header, i) => (
            <div key={i} className={s.gridHeader}>
              <span>
                {header}
                {header === "Заголовок" && tasks.length
                  ? `〔 ${tasks.length} 〕`
                  : ""}
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
          {tasks.map((task) => (
            <div
              key={task.number}
              className={s.gridRow}
              style={{ gridTemplateColumns }}
              onClick={() => onOpenTask(task.number)}
            >
              <TaskGridCell taskData={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
