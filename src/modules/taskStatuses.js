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