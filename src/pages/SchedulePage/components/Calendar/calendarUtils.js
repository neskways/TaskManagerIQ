import { startOfWeek, startOfMonth, endOfMonth, endOfWeek, addDays, isSameMonth } from "date-fns";

/**
 * Генерирует заголовки дней недели
 * @param {Date} month - текущий отображаемый месяц
 * @param {Function} formatFn - функция форматирования даты
 * @param {Object} locale - локаль
 */
export const generateDayHeaders = (month, formatFn, locale) => {
  const days = [];
  const dateFormat = "EEEEEE";
  const startDate = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });

  for (let i = 0; i < 7; i++) {
    days.push(formatFn(addDays(startDate, i), dateFormat, { locale }));
  }

  return days;
};

/**
 * Генерирует ячейки календаря
 * @param {Date} month - текущий отображаемый месяц
 * @param {Array} schedule - массив дежурных
 */
export const generateCalendarCells = (month, schedule) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const duty = schedule.find(
        (item) =>
          item.date.getDate() === day.getDate() &&
          item.date.getMonth() === day.getMonth() &&
          item.date.getFullYear() === day.getFullYear()
      );

      days.push({
        day,
        isCurrentMonth: isSameMonth(day, monthStart),
        user: duty ? duty.user : ""
      });

      day = addDays(day, 1);
    }
    rows.push(days);
    days = [];
  }

  return rows;
};
