import { useState, useEffect, useRef } from "react";
import s from "./UpdateScheduleTable.module.scss";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { useUpdateSchedule } from "./hooks/useUpdateSchedule";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";

export const UpdateScheduleTable = ({ theme }) => {
  const today = new Date();
  const monthStr = today.toLocaleString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  const monthTitle = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

  const { schedule, daysInMonth, loading, loadSchedule, error } =
    useUpdateSchedule();
  const [selectedClientUpdates, setSelectedClientUpdates] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const { showPopup } = usePopup();
  const emptyPopupShownRef = useRef(false); // ref, чтобы не сбрасывался при ререндере

  // Показываем pop-up только один раз, когда данные загрузились и пустые
  useEffect(() => {
    if (
      !loading &&
      !error &&
      schedule.length === 0 &&
      !emptyPopupShownRef.current
    ) {
      showPopup("Нет данных для отображения", { type: "info" });
      emptyPopupShownRef.current = true;
    }
  }, [loading, error, schedule, showPopup]);

  const handleRefresh = async () => {
    if (spinning) return;
    setSpinning(true);
    emptyPopupShownRef.current = false; // сбрасываем, чтобы pop-up снова мог появиться

    try {
      const updatedSchedule = await loadSchedule(true); // force reload
      if (!updatedSchedule || updatedSchedule.length === 0) {
        showPopup("Нет данных для отображения", { type: "info" });
        emptyPopupShownRef.current = true;
      }
    } catch (err) {
      console.error("Ошибка при обновлении расписания:", err);
      if (err.response?.status !== 401) {
        showPopup("Ошибка при обновлении расписания", { type: "error" });
      }
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
          <p className={s.errorText}>График обновления пуст</p>
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
