import { CloseIcon } from "../../../../UI/CloseIcon/CloseIcon";
import s from "./SidebarFilter.module.scss";

export const SidebarFilter = ({ showFilter, setShowFilter }) => {

  return (
    <div className={`${s.sidebar} ${showFilter ? s.show_filter : ""}`}>
      <div className={s.header}>
         <h3 className={s.title}>Все фильтры</h3>
         <button className={s.close_btn} title={"Закрыть"} onClick={() => setShowFilter(false)} >
          <CloseIcon />
         </button>
      </div>
    </div>
  );
};
