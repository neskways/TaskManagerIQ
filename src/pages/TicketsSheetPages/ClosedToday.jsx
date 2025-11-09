import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";
import { taskStatuses } from "../../modules/TaskStatuses";

export const ClosedToday = ({ titleText }) => {
  const queryParams = {};

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Закрытые заявки"}
      queryParams={queryParams}
    />
  );
};
