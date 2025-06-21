import s from "./Calendar.module.scss";
import { PageTitle } from "../PageTitle/PageTitle";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";

export const Calendar = () => {
  const today = new Date();
  const currentMonth = startOfMonth(today);

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEEE"; // Сокращённые дни недели (Пн, Вт и т.д.)
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={s.dayName} key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ru })}
        </div>
      );
    }

    return <div className={s.daysRow}>{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(
          <div
            className={`${s.cell} ${!isSameMonth(day, monthStart) ? s.disabled : ""}`}
            key={day}>
            <span className={s.dateNum}>{format(day, "d", { locale: ru })}</span>
            <div className={s.dataStub}>Алексей</div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className={s.row} key={day}>
          {days}
        </div>
      );

      days = [];
    }

    return <div className={s.body}>{rows}</div>;
  };

  return (
    <div className={s.calendar}>
      <h3 className={s.monthTitle}> 
        <span>График дежурств</span> 
        <span>{format(currentMonth, "LLLL yyyy", { locale: ru })}</span> 
      </h3>
      {renderDays()}
      {renderCells()}
    </div>
  );
};
