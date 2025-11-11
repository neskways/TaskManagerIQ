export const taskStatuses = {
  NEW:         { code: "000000001", title: "Новая" },
  ON_REVIEW:   { code: "000000002", title: "На оценке" },
  TRANSFERRED: { code: "000000008", title: "Передана на выполнение" },
  IN_PROGRESS: { code: "000000003", title: "Выполняется" },
  PAUSED:      { code: "000000007", title: "Приостановлена" },
  READY:       { code: "000000004", title: "Готова к сдаче" },
  DONE:        { code: "000000005", title: "Завершена" },
  CANCELED:    { code: "000000006", title: "Отменена" },
};

export const taskStatusColors = {
  "000000001": "#3498db", // Новая
  "000000002": "#9b59b6", // На оценке
  "000000003": "#f1c40f", // Выполняется
  "000000004": "#2ecc71", // Готова к сдаче
  "000000005": "#1abc9c", // Завершена
  "000000006": "#e74c3c", // Отменена
  "000000007": "#e67e22", // Приостановлена
  "000000008": "#2980b9", // Передана на выполнение
};
export const getStatusColor = (status) => {
  if (!status) return null;

  // если status уже код (9 цифр) — прямой lookup
  if (typeof status === "string" && /^\d{9}$/.test(status)) {
    return taskStatusColors[status] || null;
  }

  // если status — заголовок (title), ищем соответствующий код
  const found = Object.values(taskStatuses).find((s) => s.title === status);
  if (found && taskStatusColors[found.code]) return taskStatusColors[found.code];

  // если status приходит как код без ведущих нулей (например "3"), попробуем pad
  if (/^\d+$/.test(status)) {
    const padded = String(status).padStart(9, "0");
    return taskStatusColors[padded] || null;
  }

  return null;
};