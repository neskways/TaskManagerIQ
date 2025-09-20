import { updateSchedule } from "../../../../modules/Arrays";
import s from "./UpdateScheduleTable.module.scss";

export const UpdateScheduleTable = () => {
  const { month, daysInMonth, clients } = updateSchedule;

  const renderHeader = () => {
    return (
      <tr>
        <th className={s.stickyColumn}>Клиент</th>
        {Array.from({ length: daysInMonth }, (_, i) => (
          <th key={i + 1}>{i + 1}</th>
        ))}
      </tr>
    );
  };

  const renderRows = () => {
    return clients.map((client, index) => (
      <tr key={index}>
        <td className={s.stickyColumn}>{client.name}</td>
        {Array.from({ length: daysInMonth }, (_, dayIndex) => {
          const day = dayIndex + 1;
          const updater = client.updates[day] || "";
          return <td key={day}>{updater}</td>;
        })}
      </tr>
    ));
  };

  return (
    <div className={s.container}>
      <h2 className={s.monthTitle}>{month}</h2>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>{renderHeader()}</thead>
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};
