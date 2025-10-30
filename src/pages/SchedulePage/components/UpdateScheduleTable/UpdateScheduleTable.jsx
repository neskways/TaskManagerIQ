import { useEffect, useState } from "react";
import s from "./UpdateScheduleTable.module.scss";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { Loading } from "../../../../UI/Loading/Loading";
import { getUpdateMap } from "../../../../api/get/getUpdateMap";
import { loadCache, saveCache } from "../../../../modules/cache";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";

export const UpdateScheduleTable = ({ theme }) => {
  const today = new Date();
  const monthStr = today.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  const defaultMonthTitle = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

  const [schedule, setSchedule] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(
    new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  );
  const [monthTitle] = useState(defaultMonthTitle);
  const [loading, setLoading] = useState(false); // 🔹 по умолчанию false
  const [selectedClientUpdates, setSelectedClientUpdates] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const cacheKey = "update-schedule";

  const loadSchedule = async (force = false) => {
    if (!force) {
      const cached = loadCache(cacheKey);
      if (cached) {
        const restored = cached.map((client) => ({
          ...client,
          updates: client.updates.map((arr) =>
            arr.map((u) => ({
              ...u,
              date: new Date(u.date),
            }))
          ),
        }));
        setSchedule(restored);
        return;
      }
    }

    setLoading(true);
    try {
      const data = await getUpdateMap();
      if (!data || data.length === 0) {
        setSchedule([]);
        return;
      }

      const sampleDate = data[0].date;
      const days = new Date(sampleDate.getFullYear(), sampleDate.getMonth() + 1, 0).getDate();
      setDaysInMonth(days);

      const clientsMap = {};
      data.forEach((item) => {
        if (!item.date || !item.client) return;
        const dayIndex = item.date.getDate() - 1;

        if (!clientsMap[item.client]) {
          clientsMap[item.client] = Array(days)
            .fill(null)
            .map(() => []);
        }

        clientsMap[item.client][dayIndex].push(item);
      });

      const clientsArray = Object.entries(clientsMap).map(([name, updates]) => ({
        name,
        updates,
      }));

      saveCache(cacheKey, clientsArray);
      setSchedule(clientsArray);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (spinning) return;
    setSpinning(true);
    await loadSchedule(true);
    setTimeout(() => setSpinning(false), 1000);
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const renderHeader = () => (
    <tr>
      <th className={s.stickyColumn}>Клиент</th>
      {Array.from({ length: daysInMonth }, (_, i) => (
        <th key={i + 1}>{i + 1}</th>
      ))}
    </tr>
  );

  const renderRows = () =>
    schedule.map((client, idx) => (
      <tr key={idx}>
        <td className={s.stickyColumn}>{client.name}</td>
        {client.updates.map((updatesArray, dayIndex) => (
          <td
            key={dayIndex}
            className={s.cell}
            onClick={() =>
              updatesArray.length > 0 && setSelectedClientUpdates(updatesArray)
            }
          >
            {updatesArray.map((u) => u.employee[0]).join("")}
          </td>
        ))}
      </tr>
    ));

  return (
    <div className={s.container}>
      <div className={s.headerRow}>
        <h2 className={s.monthTitle}>{monthTitle}</h2>
        <button className={s.refreshBtn} onClick={handleRefresh}>
          <ReloadIcon theme={theme} spinning={spinning} />
        </button>
      </div>

      {loading ? (
        <div className={s.centerWrapper}>
          <Loading className={s.loading} />
        </div>
      ) : (
        <div className={s.tableWrapper}>
          <table className={s.table}>
            <thead>{renderHeader()}</thead>
            <tbody>{renderRows()}</tbody>
          </table>
        </div>
      )}

      {selectedClientUpdates && (
        <ModalWindow
          updatesArray={selectedClientUpdates}
          onClose={() => setSelectedClientUpdates(null)}
        />
      )}
    </div>
  );
};
