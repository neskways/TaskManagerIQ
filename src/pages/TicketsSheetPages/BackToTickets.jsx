import { UniversalTicketsSheet } from "../UniversalTicketsSheet/UniversalTicketsSheet";

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
