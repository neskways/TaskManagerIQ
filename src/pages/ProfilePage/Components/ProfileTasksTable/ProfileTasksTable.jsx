import s from "./ProfileTasksTable.module.scss";

// Цвета статусов по названию (совпадают с TaskGridCell)
const statusStylesByTitle = {
  "Новая": { bg: "#e8f3ff", color: "#007bff" },
  "На оценке": { bg: "#f3e9ff", color: "#8e44ad" },
  "Передана на выполнение": { bg: "#e9f2ff", color: "#2980b9" },
  "Выполняется": { bg: "#fff7e0", color: "#e67e22" },
  "Приостановлена": { bg: "#fff0e0", color: "#d35400" },
  "Готова к сдаче": { bg: "#e8f9e9", color: "#27ae60" },
  "Завершена": { bg: "#e5f8f4", color: "#16a085" },
  "Отменена/Не актуальна": { bg: "#fdecea", color: "#c0392b" },
};

export const ProfileTasksTable = ({ tasks }) => {
  return (
    <div className={s.scrollWrapper}>
      <div className={s.tableWrapper}>
        <div className={s.tableHeader}>
          <div>Номер</div>
          <div>Название</div>
          <div>Клиент</div>
          <div>Статус</div>
          <div>Исполнитель</div>
          <div>Время</div>
        </div>
        <div className={s.tableBody}>
          {tasks.map((task) => {
            const statusStyle = statusStylesByTitle[task.status] || {
              bg: "#f0f0f0",
              color: "#555",
            };

            return (
              <div key={task.number} className={s.tableRow}>
                <div>{task.number}</div>
                <div>{task.title}</div>
                <div>{task.client}</div>
                <div>
                  <span
                    className={s.statusBadge}
                    style={{
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 600,
                      borderRadius: "10px",
                      padding: "4px 10px",
                      textAlign: "center",
                      display: "inline-block",
                      minWidth: 90,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                    }}
                  >
                    {task.status}
                  </span>
                </div>
                <div>{task.executor}</div>
                <div>{task.timeSpent}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
