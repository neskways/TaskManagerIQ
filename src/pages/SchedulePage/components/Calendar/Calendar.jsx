import s from "./Calendar.module.scss";
import Cookies from "js-cookie";
import { ru } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Loading } from "../../../../UI/Loading/Loading";
import { usePopup } from "../../../../context/PopupContext";
import { getSchedule } from "../../../../api/get/getShedule";
import { ReloadIcon } from "../../../../UI/ReloadIcon/ReloadIcon";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../../../modules/localStorageUtils";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";

const CACHE_PREFIX = "schedule-";

export const Calendar = ({ theme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);

  const { showPopup } = usePopup();
  const username = Cookies.get("username");

  // Загрузка с кэшем + обработкой ошибок
  const loadSchedule = async (month, year, force = false) => {
    const key = `${CACHE_PREFIX}${year}-${month}`;

    // 1️⃣ Загружаем из кэша если не force
    if (!force) {
      const cached = getFromLocalStorage(key, null);
      if (cached) {
        return cached.map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
      }
    }

    // 2️⃣ Загружаем с сервера
    try {
      const data = await getSchedule(month, year);
      const normalized = data.map((item) => ({
        ...item,
        date: new Date(item.date),
      }));

      saveToLocalStorage(key, normalized);

      return normalized;
    } catch (err) {
      console.error("Ошибка при загрузке расписания:", err);

      if (err.response?.status !== 401) {
        showPopup("Ошибка загрузки данных", { type: "error" });
      }

      return null; // ошибка
    }
  };

  // Основная загрузка
  const fetchData = async (force = false) => {
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();

    setInitialLoading(true);

    const data = await loadSchedule(month, year, force);

    if (Array.isArray(data)) {
      setSchedule(data); // успешная загрузка
    } else {
      // ошибка: не очищаем старые данные
      console.warn("Использую старые данные — сервер недоступен");
    }

    setDisplayMonth(new Date(currentMonth));
    setInitialLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Переключение месяца — всегда пробуем загрузить (с кэшем)
  useEffect(() => {
    if (!initialLoading) fetchData(false);
  }, [currentMonth]);

  // Обновление вручную
  const handleRefresh = async () => {
    if (spinning) return;

    setSpinning(true);

    await fetchData(true);

    setTimeout(() => setSpinning(false), 600);
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  // Рендер дней недели
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

  // Рендер ячеек календаря
  const renderCells = () => {
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

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

        const dutyNames = duties
          .map((d) => {
            const parts = d.user.split(" ");
            return parts.length > 1 ? parts[1] : parts[0];
          })
          .join(" и ");

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
        {/* Месяц */}
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

        {/* Год */}
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

        {/* Кнопка обновления */}
        <button className={s.refreshBtn} onClick={handleRefresh}>
          <ReloadIcon theme={theme} spinning={spinning} />
        </button>
      </div>

      {/* Состояния */}
      {initialLoading ? (
        <div className={s.centerWrapper}>
          <Loading className={s.loading} />
        </div>
      ) : schedule.length === 0 ? (
        <div className={s.centerWrapper}>
          <p className={s.errorText}>Нет данных для отображения</p>
        </div>
      ) : (
        <>
          {renderDays()}
          {renderCells()}
        </>
      )}
    </div>
  );
};
