import s from "./Calendar.module.scss";
import Cookies from "js-cookie";
import { ru } from "date-fns/locale";
import { Popup } from "../../../../UI/Popup/Popup";
import { useState, useEffect, useRef } from "react";
import { getSchedule } from "../../../../api/getShedule";
import { Loading } from "../../../../UI/Loading/Loading";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date()); // месяц который отображаем
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  // кэш: key = "YYYY-MM", value = данные
  const cacheRef = useRef({});

  const loadSchedule = async (month, year) => {
    const key = `${year}-${month}`;
    if (cacheRef.current[key]) {
      return cacheRef.current[key];
    }

    try {
      const data = await getSchedule(month, year);
      const normalized = data.map((item) => ({
        ...item,
        date: new Date(item.date),
      }));
      cacheRef.current[key] = normalized;
      return normalized;
    } catch (err) {
      console.error("Ошибка при загрузке расписания:", err);
      setErrorMessage("Ошибка загрузки данных");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return null;
    }
  };

  // первая загрузка с лоадингом
  useEffect(() => {
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();

    loadSchedule(month, year).then((data) => {
      if (data) {
        setSchedule(data);
        setDisplayMonth(new Date(currentMonth));
      }
      setInitialLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // загрузка при смене месяца/года без лоадинга
  useEffect(() => {
    if (initialLoading) return; // первый раз уже обработан

    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();

    // показываем старый календарь, новые данные загружаются в фоне
    loadSchedule(month, year).then((data) => {
      if (data) {
        setSchedule(data);
        setDisplayMonth(new Date(currentMonth));
      }
    });
  }, [currentMonth, initialLoading]);

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
    const startDate = startOfWeek(startOfMonth(displayMonth), {
      weekStartsOn: 1,
    });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className={s.dayName} key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ru })}
        </div>
      );
    }

    return <div className={s.daysRow}>{days}</div>;
  };

  // внутри компонента Calendar
  const username = Cookies.get("username");

 const renderCells = () => {
  const monthStart = startOfMonth(displayMonth);
  const monthEnd = endOfMonth(displayMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const username = Cookies.get("username");
  const rows = [];
  let days = [];
  let day = startDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // точное сравнение без времени

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      // 🔹 Находим всех дежурных за конкретный день
      const duties = schedule.filter(
        (item) =>
          item.date.getDate() === day.getDate() &&
          item.date.getMonth() === day.getMonth() &&
          item.date.getFullYear() === day.getFullYear()
      );

      // 🔹 Если есть дежурные — соединяем их имена через " и "
      const dutyNames = duties.map((d) => d.user).join(" и ");

      const isPastDay = day < today;
      const isToday = day.getTime() === today.getTime();
      const isActiveUser = duties.some((d) => d.user === username);

      days.push(
        <div
          className={`${s.cell} ${
            !isSameMonth(day, monthStart) ? s.disabled : ""
          } ${isPastDay ? s.closen_day : ""}`}
          key={day.toISOString()}
        >
          <span className={s.dateNum}>
            {format(day, "d", { locale: ru })}
          </span>
          <div className={s.dataStub}>
            {dutyNames ? (
              <span
                className={`${isActiveUser ? s.active_duty : ""} ${
                  isToday ? s.today : ""
                }`}
              >
                {dutyNames}
              </span>
            ) : (
              ""
            )}
          </div>
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
      {/* селекторы */}
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

      {/* контент */}
      {initialLoading ? (
        <div className={s.centerWrapper}>
          <Loading className={s.loading} />
        </div>
      ) : errorMessage && schedule.length === 0 ? (
        <div className={s.centerWrapper}>
          <p className={s.errorText}>{errorMessage}</p>
        </div>
      ) : (
        <>
          {renderDays()}
          {renderCells()}
        </>
      )}

      <Popup showPopup={showPopup} text={errorMessage} />
    </div>
  );
};
