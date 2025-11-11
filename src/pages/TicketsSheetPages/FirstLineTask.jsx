import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const FirstLineTask = () => {
  const params = {
    states: [taskStatuses.PAUSED.code, taskStatuses.IN_PROGRESS.code, taskStatuses.TRANSFERRED.code, taskStatuses.CANCELED.code, taskStatuses.NEW.code, taskStatuses.READY.code],
    firstline: "true",
  };

  return <UniversalTicketsSheet titleText="Текущие задачи первой линии" queryParams={params} />;
};
