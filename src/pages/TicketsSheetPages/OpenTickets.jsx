import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const OpenTickets = ({ titleText }) => {

  const queryParams = {};

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Открытые заявки"}
      queryParams={queryParams}
    />
  );
};
