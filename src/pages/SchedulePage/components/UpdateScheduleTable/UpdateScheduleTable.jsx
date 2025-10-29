// UpdateScheduleTable.jsx
import { useEffect, useState } from "react";
import s from "./UpdateScheduleTable.module.scss";
import { Loading } from "../../../../UI/Loading/Loading";
import { getUpdateMap } from "../../../../api/get/getUpdateMap";
import { ModalWindow } from "./ModalWindow/ModalWindow";

export const UpdateScheduleTable = () => {
  const today = new Date();
  const monthStr = today.toLocaleString("ru-RU", { month: "long", year: "numeric" });
  const defaultMonthTitle = monthStr.charAt(0).toUpperCase() + monthStr.slice(1);

  const [schedule, setSchedule] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate());
  const [monthTitle] = useState(defaultMonthTitle);
  const [loading, setLoading] = useState(true);
  const [selectedClientUpdates, setSelectedClientUpdates] = useState(null);

  useEffect(() => {
    const loadSchedule = async () => {
      setLoading(true);

      try {
        const data = await getUpdateMap();
        if (!data || data.length === 0) {
          setSchedule([]);
          setLoading(false);
          return;
        }

        const sampleDate = data[0].date;
        const days = new Date(sampleDate.getFullYear(), sampleDate.getMonth() + 1, 0).getDate();
        setDaysInMonth(days);

        // Сбор обновлений по клиенту и дню в массивы
        const clientsMap = {};
        data.forEach(item => {
          if (!item.date || !item.client) return;
          const dayIndex = item.date.getDate() - 1;

          if (!clientsMap[item.client]) {
            clientsMap[item.client] = Array(days).fill(null).map(() => []); // массив массивов
          }

          clientsMap[item.client][dayIndex].push(item); // пушим все обновления на этот день
        });

        const clientsArray = Object.entries(clientsMap).map(([name, updates]) => ({
          name,
          updates
        }));

        setSchedule(clientsArray);
        setLoading(false);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setSchedule([]);
        setLoading(false);
      }
    };

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
            onClick={() => updatesArray.length > 0 && setSelectedClientUpdates(updatesArray)}
          >
            {/* Показываем первые буквы всех сотрудников через запятую */}
            {updatesArray.map(u => u.employee[0]).join("")}
          </td>
        ))}
      </tr>
    ));

  return (
    <div className={s.container}>
      <h2 className={s.monthTitle}>{monthTitle}</h2>

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
