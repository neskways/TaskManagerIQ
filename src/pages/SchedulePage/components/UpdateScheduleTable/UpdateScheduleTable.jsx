import { useState } from "react";
import s from "./UpdateScheduleTable.module.scss";
import { ModalWindow } from "./ModalWindow/ModalWindow";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { useUpdateSchedule } from "./hooks/useUpdateSchedule";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";

export const UpdateScheduleTable = ({ theme }) => {
  const {
    schedule,
    daysInMonth,
    loading,
    loadSchedule,
    error,
  } = useUpdateSchedule();

  const { showPopup } = usePopup();

  const [selectedClientUpdates, setSelectedClientUpdates] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = async () => {
    if (spinning) return;

    setSpinning(true);

    const result = await loadSchedule(true);

    if (result === null) {
      showPopup("Ошибка обновления графика", { type: "error" });
    } else if (Array.isArray(result) && result.length === 0) {
      showPopup("Нет данных для отображения", { type: "info" });
    }

    setTimeout(() => setSpinning(false), 700);
  };

  const renderHeader = () => (
    <tr>
      <th className={s.stickyColumn}>Клиент</th>
      {Array.from({ length: daysInMonth }, (_, i) => (
        <th key={i}>{i + 1}</th>
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
        <button className={s.refreshBtn} onClick={handleRefresh}>
          <ReloadIcon theme={theme} spinning={spinning} />
        </button>
      </div>

      {loading ? (
        <div className={s.centerWrapper}>
          <Loading className={s.loading} />
        </div>
      ) : error && schedule.length === 0 ? (
        <div className={s.centerWrapper}>
          <p className={s.errorText}>Ошибка: не удалось загрузить график</p>
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
