import s from "./Sidebar.module.scss";

export const Sidebar = ({ reports, selectedReport, onSelect }) => {
  return (
    <div className={s.block}>
      <div className={s.list}>
        {reports.map((report) => {
          const isActive = selectedReport.id === report.id;

          return (
            <div
              key={report.id}
              className={`${s.item} ${isActive ? s.active : ""}`}
              onClick={() => onSelect(report)}
            >
              {report.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};