import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const OverdueTickets = ({ titleText }) => {

  const queryParams = {};

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Просроченные заявки"}
      queryParams={queryParams}
    />
  );
};
