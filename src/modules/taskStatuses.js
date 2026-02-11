export const taskStatuses = {
  NEW:         { code: "000000001", name: "Новая" },
  ON_REVIEW:   { code: "000000002", name: "На оценке" },
  TRANSFERRED: { code: "000000008", name: "Передана на выполнение" },
  IN_PROGRESS: { code: "000000003", name: "Выполняется" },
  PAUSED:      { code: "000000007", name: "Приостановлена" },
  WATING:      { code: "000000009", name: "Ожидаем ответ клиента" },
  READY:       { code: "000000004", name: "Готова к сдаче" },
  DONE:        { code: "000000005", name: "Сдана клиенту" },
  CANCELED:    { code: "000000006", name: "Отменена/Не актуальна" },
};

export const statusStylesByTitle = {
  "Новая": { bg: "#e8f3ff", color: "#007bff" },
  "На оценке": { bg: "#f3e9ff", color: "#8e44ad" },
  "Передана на выполнение": { bg: "#e9f2ff", color: "#2980b9" },
  "Выполняется": { bg: "#fff7e0", color: "#e67e22" },
  "Приостановлена": { bg: "#fff0e0", color: "#d35400" },
  "Готова к сдаче": { bg: "#e8f9e9", color: "#27ae60" },
  "Сдана клиенту": { bg: "#e5f8f4", color: "#16a085" },
  "Отменена/Не актуальна": { bg: "#fdecea", color: "#c0392b" },
  "Ожидаем ответ клиента": { bg: "#e9f2ff", color: "#ff35d3ff" },
};

export const statusesList = [
  { code: "000000001", name: "Новая" },
  { code: "000000002", name: "На оценке" },
  { code: "000000003", name: "Выполняется" },
  { code: "000000004", name: "Готова к сдаче" },
  { code: "000000005", name: "Сдана клиенту" },
  { code: "000000006", name: "Отменена/Не актуальна" },
  { code: "000000007", name: "Приостановлена" },
  { code: "000000008", name: "Передана на выполнение" },
  { code: "000000009", name: "Ожидаем ответ клиента" },
];

export const statusTransitions = {
  [taskStatuses.NEW.code]: [
    taskStatuses.ON_REVIEW.code,
    taskStatuses.TRANSFERRED.code,
    taskStatuses.CANCELED.code,
    taskStatuses.WATING.code,
  ],

  [taskStatuses.ON_REVIEW.code]: [
    taskStatuses.TRANSFERRED.code,
    taskStatuses.CANCELED.code,
    taskStatuses.WATING.code,
  ],

  [taskStatuses.TRANSFERRED.code]: [
    taskStatuses.IN_PROGRESS.code,
    taskStatuses.WATING.code,
    taskStatuses.CANCELED.code,
  ],

  [taskStatuses.PAUSED.code]: [
    taskStatuses.IN_PROGRESS.code,
    taskStatuses.WATING.code,
    taskStatuses.CANCELED.code,
  ],

  [taskStatuses.IN_PROGRESS.code]: [
    taskStatuses.PAUSED.code,
    taskStatuses.READY.code,
  ],

  [taskStatuses.WATING.code]: Object.values(taskStatuses)
    .map(s => s.code)
    .filter(code =>
      code !== taskStatuses.NEW.code &&
      code !== taskStatuses.ON_REVIEW.code
    ),

  [taskStatuses.READY.code]: [
    taskStatuses.DONE.code,
    taskStatuses.CANCELED.code,
  ],

  [taskStatuses.DONE.code]: [],

  [taskStatuses.CANCELED.code]: [],
};
