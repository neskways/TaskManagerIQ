import s from "./Calendar.module.scss";
import Cookies from "js-cookie";
import { ru } from "date-fns/locale";
import { Popup } from "../../../../UI/Popup/Popup";
import { useState, useEffect, useRef } from "react";
import { getSchedule } from "../../../../api/get/getShedule";
import { Loading } from "../../../../UI/Loading/Loading";
import { loadCache, saveCache } from "../../../../modules/cache";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

export const Calendar = ({ theme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  const cacheRef = useRef({});

  const loadSchedule = async (month, year, force = false) => {
    const key = `schedule-${year}-${month}`;
    if (!force) {
      const cached = loadCache(key);
      if (cached) {
        return cached.map((item) => ({ ...item, date: new Date(item.date) }));
      }
    }

    try {
      const data = await getSchedule(month, year);
      const normalized = data.map((item) => ({ ...item, date: new Date(item.date) }));
      saveCache(key, normalized);
      return normalized;
    } catch (err) {
      console.error("Ошибка при загрузке расписания:", err);
      setErrorMessage("Ошибка загрузки данных");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return null;
    }
  };

  const handleRefresh = async () => {
    if (spinning) return; // защита от спама кликов
    setSpinning(true);
    setInitialLoading(true);
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();
    const data = await loadSchedule(month, year, true);
    if (data) setSchedule(data);
    setInitialLoading(false);
    setTimeout(() => setSpinning(false), 1000);
  };

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
  }, []);

  useEffect(() => {
    if (initialLoading) return;
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();
    loadSchedule(month, year).then((data) => {
      if (data) {
        setSchedule(data);
        setDisplayMonth(new Date(currentMonth));
      }
    });
  }, [currentMonth, initialLoading]);

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEEEEE";
    const startDate = startOfWeek(startOfMonth(displayMonth), { weekStartsOn: 1 });

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
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const username = Cookies.get("username");

    const rows = [];
    let days = [];
    let day = startDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const duties = schedule.filter(
          (item) =>
            item.date.getDate() === day.getDate() &&
            item.date.getMonth() === day.getMonth() &&
            item.date.getFullYear() === day.getFullYear()
        );

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
            <span className={s.dateNum}>{format(day, "d", { locale: ru })}</span>
            <div className={s.dataStub}>
              {dutyNames && (
                <span
                  className={`${isActiveUser ? s.active_duty : ""} ${
                    isToday ? s.today : ""
                  }`}
                >
                  {dutyNames}
                </span>
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
      <div className={s.controls}>
        <select
          className={s.select}
          value={currentMonth.getMonth()}
          onChange={(e) => {
            const newDate = new Date(currentMonth);
            newDate.setMonth(parseInt(e.target.value, 10));
            setCurrentMonth(newDate);
          }}
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
          onChange={(e) => {
            const newDate = new Date(currentMonth);
            newDate.setFullYear(parseInt(e.target.value, 10));
            setCurrentMonth(newDate);
          }}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <button className={s.refreshBtn} onClick={handleRefresh}>
          <ReloadIcon theme={theme} spinning={spinning} />
        </button>
      </div>

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
