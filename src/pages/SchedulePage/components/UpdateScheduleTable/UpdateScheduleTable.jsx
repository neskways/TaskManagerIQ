import { useState, useEffect } from "react";
import s from "./UpdateScheduleTable.module.scss";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext"; 
import { useUpdateSchedule } from "./hooks/useUpdateSchedule";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";

export const UpdateScheduleTable = ({ theme }) => {
  const today = new Date();
  const monthStr = today.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  const monthTitle = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

  const { schedule, daysInMonth, loading, loadSchedule, error } = useUpdateSchedule();
  const [selectedClientUpdates, setSelectedClientUpdates] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const { showPopup } = usePopup(); 

  // Показываем popup только если ошибка НЕ 401
  useEffect(() => {
    if (!loading && error && error.response?.status !== 401) {
      showPopup("Ошибка загрузки расписания", { type: false });
    }
  }, [loading, error, showPopup]);

  const handleRefresh = async () => {
    if (spinning) return;
    setSpinning(true);
    try {
      await loadSchedule(true);
    } catch (err) {
      console.error("Ошибка при обновлении расписания:", err);
      if (err.response?.status !== 401) {
        showPopup("Ошибка при обновлении расписания", { type: false });
      }
      // 401 уже обработан interceptor'ом
    } finally {
      setTimeout(() => setSpinning(false), 1000);
    }
  };

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
      ) : schedule.length === 0 ? (
        <div className={s.centerWrapper}>
          <p className={s.errorText}>Нет данных для отображения</p>
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
