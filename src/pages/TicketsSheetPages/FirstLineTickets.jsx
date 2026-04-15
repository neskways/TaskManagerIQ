import { taskStatuses } from "../../modules/taskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const FirstLineTickets = () => {
  const params = {
    states: [
      taskStatuses.PAUSED.code,
      taskStatuses.IN_PROGRESS.code,
      taskStatuses.TRANSFERRED.code,
      taskStatuses.NEW.code,
      taskStatuses.READY.code,
    ],
    firstline: "true",
  };

  return (
    <UniversalTicketsSheet
      titleText="Заявки первой линии"
      queryParams={params}
    />
  );
};
