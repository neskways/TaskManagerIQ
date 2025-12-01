export const taskStatuses = {
  NEW:         { code: "000000001", name: "Новая" },
  ON_REVIEW:   { code: "000000002", name: "На оценке" },
  TRANSFERRED: { code: "000000008", name: "Передана на выполнение" },
  IN_PROGRESS: { code: "000000003", name: "Выполняется" },
  PAUSED:      { code: "000000007", name: "Приостановлена" },
  READY:       { code: "000000004", name: "Готова к сдаче" },
  DONE:        { code: "000000005", name: "Сдана клиенту" },
  CANCELED:    { code: "000000006", name: "Отменена/Не актуальная" },
};

export const statusStylesByTitle = {
  "Новая": { bg: "#e8f3ff", color: "#007bff" },
  "На оценке": { bg: "#f3e9ff", color: "#8e44ad" },
  "Передана на выполнение": { bg: "#e9f2ff", color: "#2980b9" },
  "Выполняется": { bg: "#fff7e0", color: "#e67e22" },
  "Приостановлена": { bg: "#fff0e0", color: "#d35400" },
  "Готова к сдаче": { bg: "#e8f9e9", color: "#27ae60" },
  "Завершена": { bg: "#e5f8f4", color: "#16a085" },
  "Отменена/Не актуальна": { bg: "#fdecea", color: "#c0392b" },
};