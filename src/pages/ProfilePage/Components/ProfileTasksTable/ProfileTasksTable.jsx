import s from "./ProfileTasksTable.module.scss";
import { statusStylesByTitle } from "../../../../modules/taskStatuses";

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
