import s from "./UniversalTicketsSheet.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { TicketsTable } from "../../components/TicketsTable/TicketsTable";
import { SidebarFilter } from "../../components/SidebarFilter/SidebarFilter";
import { useState } from "react";

export const UniversalTicketsSheet = ({ url, titleText }) => {

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <button onClick={() => setShowFilter(!showFilter)}>sdf</button>
      <TicketsTable />
      <SidebarFilter showFilter={showFilter} />
    </div>
  );
};
