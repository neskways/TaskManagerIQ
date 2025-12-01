import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const AllTickets = ({ titleText }) => {
  const queryParams = {};

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Все заявки"}
      queryParams={queryParams}
    />
  );
};
