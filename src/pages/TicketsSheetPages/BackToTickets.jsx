import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const BackToTickets = ({ titleText }) => {
  const queryParams = {
    return: "true"
  };

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Возврат к заявкам"}
      queryParams={queryParams}
    />
  );
};
