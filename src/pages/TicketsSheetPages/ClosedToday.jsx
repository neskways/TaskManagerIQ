import { taskStatuses } from "../../modules/taskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const ClosedToday = ({ titleText }) => {

  const params = {
    states: [taskStatuses.IN_PROGRESS.code],
  };

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Закрытые заявки"}
      queryParams={params}
    />
  );
};
