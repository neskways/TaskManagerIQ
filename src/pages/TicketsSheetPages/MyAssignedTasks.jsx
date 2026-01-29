import Cookies from "js-cookie";
import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const MyAssignedTasks = () => {

  const userCode = Cookies.get("userCode");

  const params = {
    states: [taskStatuses.PAUSED.code, taskStatuses.IN_PROGRESS.code, taskStatuses.TRANSFERRED.code, taskStatuses.READY.code, taskStatuses.NEW.code, taskStatuses.ON_REVIEW.code],
    userCode,
  };

  return <UniversalTicketsSheet titleText="Назначенные мне заявки" queryParams={params} />;
};
