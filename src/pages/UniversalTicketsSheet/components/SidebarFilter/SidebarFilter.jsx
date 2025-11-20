import { CloseIcon } from "../../../../UI/CloseIcon/CloseIcon";
import s from "./SidebarFilter.module.scss";
import { Button } from "../../../../UI/Button/Button";
import { taskStatuses } from "../../../../modules/TaskStatuses";
import { MultiSelector } from "../../../../UI/MultiSelector/MultiSelector";

export const SidebarFilter = ({
  showFilter,
  setShowFilter,
  selectedStatuses,
  setSelectedStatuses,
  onApply,
  onReset
}) => {
  const statusesList = Object.values(taskStatuses);

  return (
    <div className={`${s.sidebar} ${showFilter ? s.show_filter : ""}`}>
      <div className={s.header}>
        <h3 className={s.title}>Все фильтры</h3>
        <button className={s.close_btn} onClick={() => setShowFilter(false)}>
          <CloseIcon />
        </button>
      </div>

      <div className={s.block}>
        <div className={s.selecter_wrap}>
          <MultiSelector
            title="Статус"
            items={statusesList}
            value={selectedStatuses || []}
            onChange={setSelectedStatuses}
          />
        </div>
      </div>

      <div className={s.footer}>
        <Button name="Применить" onClick={onApply} />
        <Button name="Сбросить" color="secondary" onClick={onReset} />
      </div>
    </div>
  );
};
