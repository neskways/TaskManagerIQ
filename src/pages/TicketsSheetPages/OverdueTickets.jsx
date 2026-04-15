import { taskStatuses } from "../../modules/taskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const OverdueTickets = ({ titleText }) => {

  const params = {
    states: [taskStatuses.IN_PROGRESS.code],
  };

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Просроченные заявки"}
      queryParams={params}
    />
  );
};
