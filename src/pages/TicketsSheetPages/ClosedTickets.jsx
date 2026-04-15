import { taskStatuses } from "../../modules/taskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const ClosedTickets = ({ titleText }) => {
  const queryParams = {
    states: [taskStatuses.DONE.code],
  };

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Закрытые заявки"}
      queryParams={queryParams}
    />
  );
};
