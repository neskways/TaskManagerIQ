import s from "./TasksTable.module.scss";
import Cookies from "js-cookie";
import { useEffect, useRef, useState, useMemo } from "react";
import { headersTitleTask } from "./TitlesForTables";
import { MESSAGES } from "../../../../modules/messages";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { TaskGridCell } from "../TaskGridCell/TaskGridCell";
import { getTasksList } from "../../../../api/get/getTasksList";
import { Filter } from "./Components/Filter/Filter";
import { useClientsAndEmployees } from "../../../CreateTicketPage/hooks/useClientsAndEmployees";

const REFRESH_INTERVAL_MS = 30000;
const LOCAL_STORAGE_KEY_TICKETS = "tickets_table_col_widths";
const FILTER_STORAGE_KEY = "tasks_table_filters";
const SORT_STORAGE_KEY = "tasks_table_sort";

const DEFAULT_WIDTHS = [5, 33, 14, 16, 11, 8, 7, 7];

export const TasksTable = ({
  queryParams,
  onOpenTask,
  refetchKey,
  isTaskOpen,
}) => {
  const { showPopup } = usePopup();
  const userCode = Cookies.get("userCode");

  // ===== SORT STATE (with cache + default by number asc) =====


  const [sortConfig, setSortConfig] = useState(() => {
    const saved = localStorage.getItem(SORT_STORAGE_KEY);

    if (!saved) {
      return {
        key: "number",
        direction: "asc",
      };
    }

    try {
      const parsed = JSON.parse(saved);

      return {
        key: parsed?.key || "number",
        direction: parsed?.direction || "asc",
      };
    } catch {
      return {
        key: "number",
        direction: "asc",
      };
    }
  });

  const [colWidths] = useState(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TICKETS)) ||
      DEFAULT_WIDTHS
  );

  // ===== FILTER STATE (with cache) =====

  const [showFilter, setShowFilter] = useState(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return false;

    try {
      return JSON.parse(saved)?.showFilter ?? false;
    } catch {
      return false;
    }
  });

  const [selectedStatuses, setSelectedStatuses] = useState(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return [];

    try {
      return JSON.parse(saved)?.selectedStatuses ?? [];
    } catch {
      return [];
    }
  });

  const [selectedEmployees, setSelectedEmployees] = useState(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return [];

    try {
      return JSON.parse(saved)?.selectedEmployees ?? [];
    } catch {
      return [];
    }
  });

  const [selectedClient, setSelectedClient] = useState(() => {
    const saved = localStorage.getItem(FILTER_STORAGE_KEY);
    if (!saved) return null;

    try {
      return JSON.parse(saved)?.selectedClient ?? null;
    } catch {
      return null;
    }
  });

  const { clients, loading: clientsLoading } = useClientsAndEmployees();

  const [rawTasks, setRawTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const pollingRef = useRef(null);
  const firstLoadRef = useRef(true);

  const gridTemplateColumns = colWidths
    .map((w) => `minmax(40px, ${w}%)`)
    .join(" ");

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

  // ===== SAVE COL WIDTHS =====

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_TICKETS,
      JSON.stringify(colWidths)
    );
  }, [colWidths]);

  // ===== SAVE FILTER STATE =====

  useEffect(() => {
    localStorage.setItem(
      FILTER_STORAGE_KEY,
      JSON.stringify({
        showFilter,
        selectedStatuses,
        selectedEmployees,
        selectedClient,
      })
    );
  }, [
    showFilter,
    selectedStatuses,
    selectedEmployees,
    selectedClient,
  ]);

  // ===== SAVE SORT STATE =====

  useEffect(() => {
    localStorage.setItem(
      SORT_STORAGE_KEY,
      JSON.stringify(sortConfig)
    );
  }, [sortConfig]);

  const loadTasks = async (isSilent = false) => {
    try {
      if (!isSilent && firstLoadRef.current) {
        setLoading(true);
      }

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
        timeSpent: item.timeSpent,
        timeSpentFormatted: `${String(
          Math.floor(item.timeSpent / 3600)
        ).padStart(2, "0")}:${String(
          Math.floor((item.timeSpent % 3600) / 60)
        ).padStart(2, "0")}:${String(item.timeSpent % 60).padStart(
          2,
          "0"
        )}`,
      }));

      setRawTasks(mapped);
      firstLoadRef.current = false;
    } catch (err) {
      console.error(err);

      if (err.response?.status !== 401) {
        showPopup(MESSAGES.loadTaskError, {
          type: "error",
        });
      }
    } finally {
      if (!isSilent) {
        setLoading(false);
      }
    }
  };

  // ===== INITIAL LOAD =====

  useEffect(() => {
    loadTasks(false);
  }, []);

  // ===== MANUAL REFETCH =====

  useEffect(() => {
    if (refetchKey != null) {
      loadTasks(false);
    }
  }, [refetchKey]);

  // ===== POLLING (SILENT UPDATE) =====

  useEffect(() => {
    if (isTaskOpen) return;

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(() => {
      loadTasks(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(pollingRef.current);
  }, [isTaskOpen, userCode, queryParams]);

  // ===== FILTER =====

  useEffect(() => {
    const filtered = rawTasks.filter((t) => {
      const statusOk = selectedStatuses.length
        ? selectedStatuses.includes(t.status)
        : true;

      const employeeOk = selectedEmployees.length
        ? selectedEmployees.includes(t.executor)
        : true;

      const clientName =
        typeof selectedClient === "string"
          ? selectedClient
          : selectedClient?.name;

      const clientOk = clientName
        ? t.client
            .toLowerCase()
            .includes(clientName.toLowerCase())
        : true;

      return statusOk && employeeOk && clientOk;
    });

    setTasks(filtered);
  }, [
    selectedStatuses,
    selectedEmployees,
    selectedClient,
    rawTasks,
  ]);

  // ===== SORT =====
  const sortedTasks = useMemo(() => {
    if (!sortConfig.key) return tasks;

    return [...tasks].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === "timeSpent") {
        valA = a.timeSpent;
        valB = b.timeSpent;
      }

      if (sortConfig.key === "createdDate") {
        const parseDate = (d) => {
          if (!d) return 0;

          const [day, month, year] = d.split(".");

          return new Date(
            year,
            month - 1,
            day
          ).getTime();
        };

        valA = parseDate(valA);
        valB = parseDate(valB);
      }

      const numA = parseFloat(valA);
      const numB = parseFloat(valB);

      if (!isNaN(numA) && !isNaN(numB)) {
        return sortConfig.direction === "asc"
          ? numA - numB
          : numB - numA;
      }

      valA = String(valA || "").toLowerCase();
      valB = String(valB || "").toLowerCase();

      if (valA < valB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }

      if (valA > valB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [tasks, sortConfig]);

  const handleHeaderClick = (index) => {
    const key = keyMap[index];
    if (!key) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction:
            prev.direction === "asc"
              ? "desc"
              : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  };

  const getSortArrow = (index) => {
    return sortConfig.key === keyMap[index]
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : null;
  };
const activeFiltersCount =
  selectedStatuses.length +
  selectedEmployees.length +
  (selectedClient ? 0 : 0);
  return (
    <>
      <div className={s.wrapper}>
        <div className={s.btn_wrapper}>
          <button
            className={s.filter_btn}
            onClick={() =>
              setShowFilter((prev) => !prev)
            }
          >
            Фильтр
          </button>

          {activeFiltersCount > 0 && !showFilter && (
          <div className={s.filter_badge}>
            {activeFiltersCount}
          </div>
        )}

        </div>

        <Filter
          showFilter={showFilter}
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          selectedEmployees={selectedEmployees}
          setSelectedEmployees={setSelectedEmployees}
          clients={clients}
          clientsLoading={clientsLoading}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          onReset={() => {
            setSelectedStatuses([]);
            setSelectedEmployees([]);
            setSelectedClient(null);
          }}
        />

        <div className={s.gridTableWrapper}>
          <div
            className={s.gridHeaderRow}
            style={{ gridTemplateColumns }}
          >
            {headersTitleTask.map((header, i) => (
              <div
                key={i}
                className={s.gridHeader}
                onClick={() =>
                  handleHeaderClick(i)
                }
              >
                <span>
                  {header}

                  {header === "Заголовок" &&
                    sortedTasks.length > 0 && (
                      <span className={s.count}>
                        〔 {sortedTasks.length} 〕
                      </span>
                    )}

                  <span className={s.sortArrow}>
                    {getSortArrow(i)}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className={s.gridBody}>
            {loading && (
              <div className={s.centerWrapper}>
                <Loading />
              </div>
            )}

            {sortedTasks.map((task) => (
              <div
                key={task.number}
                className={s.gridRow}
                style={{ gridTemplateColumns }}
                onClick={() =>
                  onOpenTask(task.number)
                }
              >
                <TaskGridCell
                  taskData={{
                    ...task,
                    timeSpent:
                      task.timeSpentFormatted,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};