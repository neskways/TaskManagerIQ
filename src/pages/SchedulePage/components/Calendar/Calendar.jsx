import { useState, useEffect } from "react";
import s from "./Calendar.module.scss";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ru } from "date-fns/locale";
import { getSchedule } from "../../../../api/getShedule";

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedule, setSchedule] = useState([]);

  // загрузка расписания при смене месяца/года
  useEffect(() => {
    const month = currentMonth.getMonth() + 1; // месяцы JS начинаются с 0
    const year = currentMonth.getFullYear();

    getSchedule(month, year).then((data) => setSchedule(data));
  }, [currentMonth]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const handleMonthChange = (event) => {
    const month = parseInt(event.target.value, 10);
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
  };

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEEE";
    const startDate = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });

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
        // ищем пользователя по дате
        const duty = schedule.find((item) => isSameDay(item.date, day));

        days.push(
          <div
            className={`${s.cell} ${!isSameMonth(day, monthStart) ? s.disabled : ""}`}
            key={day.toISOString()}
          >
            <span className={s.dateNum}>{format(day, "d", { locale: ru })}</span>
            <div className={s.dataStub}>{duty ? duty.user : ""}</div>
          </div>
        );
        day = addDays(day, 1);
      }

      rows.push(
        <div className={s.row} key={day.toISOString()}>
          {days}
        </div>
      );

      days = [];
    }

    return <div className={s.body}>{rows}</div>;
  };

  return (
    <div className={s.calendar}>
      <div className={s.controls}>
        <select
          className={s.select}
          value={currentMonth.getMonth()}
          onChange={handleMonthChange}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i} value={i}>
              {format(new Date(2020, i), "LLLL", { locale: ru })}
            </option>
          ))}
        </select>

        <select
          className={s.select}
          value={currentMonth.getFullYear()}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {renderDays()}
      {renderCells()}
    </div>
  );
};
