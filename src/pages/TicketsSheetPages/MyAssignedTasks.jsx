import Cookies from "js-cookie";
import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const MyAssignedTasks = () => {

  const userCode = Cookies.get("userCode");

  const params = {
    states: [taskStatuses.PAUSED.code, taskStatuses.IN_PROGRESS.code, taskStatuses.TRANSFERRED.code],
    userCode,
    firstline: "true",
  };

  return <UniversalTicketsSheet titleText="Назначенные мне" queryParams={params} />;
};
