import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

export const AllTickets = ({ titleText }) => {
  const queryParams = {}; // без фильтров

  return (
    <UniversalTicketsSheet
      titleText={titleText || "Все заявки"}
      queryParams={queryParams}
    />
  );
};
