import { CloseIcon } from "../../../../UI/CloseIcon/CloseIcon";
import s from "./SidebarFilter.module.scss";
import { Selector } from "../../../../UI/Selector/Selector";
import { ClientSearch } from "../../../CreateTicketPage/components/ClientSearch/ClientSearch";
import { Button } from "../../../../UI/Button/Button";

export const SidebarFilter = ({ showFilter, setShowFilter }) => {
  const clients = [];
  const employees = [];
  const statusOptions = [
    { id: "new", name: "Новая" },
    { id: "in_progress", name: "Выполняется" },
    { id: "ready_for_review", name: "Готова к сдаче" },
    { id: "review", name: "На оценке" },
    { id: "done", name: "Завершена" },
    { id: "canceled", name: "Отменена" },
  ];

  return (
    <div className={`${s.sidebar} ${showFilter ? s.show_filter : ""}`}>
      <div className={s.header}>
        <h3 className={s.title}>Все фильтры</h3>
        <button
          className={s.close_btn}
          title="Закрыть"
          onClick={() => setShowFilter(false)}
        >
          <CloseIcon />
        </button>
      </div>

      <div className={s.block}>
        <ClientSearch clients={clients} text="КЛИЕНТ" />

        <div className={s.selecter_wrap}>
          <Selector items={statusOptions} title="СТАТУС" />
        </div>

        <div className={s.selecter_wrap}>
          <Selector items={employees} title="ИСПОЛНИТЕЛЬ" />
        </div>
      </div>

      <div className={s.footer}>
        <Button name="Применить" />
        <Button name="Сбросить" color="secondary" />
      </div>
    </div>
  );
};
