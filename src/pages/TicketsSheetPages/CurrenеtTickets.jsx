
import { taskStatuses } from "../../modules/taskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const CurrenеtTickets = () => {
  const params = {
    states: [taskStatuses.IN_PROGRESS.code],
  };

  return <UniversalTicketsSheet titleText="Текущие заявки" queryParams={params} />;
};
