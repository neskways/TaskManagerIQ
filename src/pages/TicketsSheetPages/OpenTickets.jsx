import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const OpenTickets = ({ titleText }) => {
  const queryParams = {
    states: [
      taskStatuses.PAUSED.code,
      taskStatuses.IN_PROGRESS.code,
      taskStatuses.TRANSFERRED.code,
      taskStatuses.NEW.code,
      taskStatuses.READY.code,
      taskStatuses.ON_REVIEW.code,
    ],
  };

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Открытые заявки"}
      queryParams={queryParams}
    />
  );
};
