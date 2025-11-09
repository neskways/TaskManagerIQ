import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const CurrentTasks = () => {
  const params = {
    states: [taskStatuses.IN_PROGRESS.code],
  };

  return <UniversalTicketsSheet titleText="Текущие задачи сотрудников" queryParams={params} />;
};
