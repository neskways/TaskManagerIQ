import s from "./UniversalTicketsSheet.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { TicketsTable } from "../../components/TicketsTable/TicketsTable";

export const UniversalTicketsSheet = ({ url, titleText }) => {
  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <TicketsTable />
    </div>
  );
}
