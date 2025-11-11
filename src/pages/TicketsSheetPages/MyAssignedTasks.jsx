import Cookies from "js-cookie";
import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const MyAssignedTasks = () => {

  const userCode = Cookies.get("userCode");

  const params = {
    states: [taskStatuses.PAUSED.code, taskStatuses.IN_PROGRESS.code, taskStatuses.TRANSFERRED.code, taskStatuses.READY.code],
    userCode,
  };

  return <UniversalTicketsSheet titleText="Назначенные мне" queryParams={params} />;
};
