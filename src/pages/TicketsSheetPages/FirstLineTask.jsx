import { taskStatuses } from "../../modules/TaskStatuses";
import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const FirstLineTask = () => {
  const params = {
    firstline: "true",
  };

  return <UniversalTicketsSheet titleText="Текущие задачи первой линии" queryParams={params} />;
};
