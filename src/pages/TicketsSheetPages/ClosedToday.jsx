import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const ClosedToday = ({ titleText }) => {
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
