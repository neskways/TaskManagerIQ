import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../UI/CloseIcon/CloseIcon";
import s from "./SidebarFilter.module.scss";
import { Button } from "../../../../UI/Button/Button";
import { MultiSelector } from "../../../../UI/MultiSelector/MultiSelector";
import { getEmployees } from "../../../../api/get/getEmployee";
import { ClientSearch } from "../../../CreateTicketPage/components/ClientSearch/ClientSearch";

export const SidebarFilter = ({
  showFilter,
  setShowFilter,
  selectedStatuses,
  setSelectedStatuses,
  selectedEmployees,
  setSelectedEmployees,
  clients = [],                 
  clientsLoading = false,       
  selectedClient,
  setSelectedClient,
  onReset
}) => {
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    getEmployees().then((data) => {
      const list = data.map((emp) => ({ id: emp.Name, name: emp.Name }));
      setEmployeesList(list);
    });
  }, []);

  const statusesList = [
    { code: "000000001", name: "Новая" },
    { code: "000000002", name: "На оценке" },
    { code: "000000008", name: "Передана на выполнение" },
    { code: "000000003", name: "Выполняется" },
    { code: "000000007", name: "Приостановлена" },
    { code: "000000004", name: "Готова к сдаче" },
    { code: "000000005", name: "Сдана клиенту" },
    { code: "000000006", name: "Отменена/Не актуальная" }
  ];

  return (
    <>
      <div
        className={`${s.overlay} ${showFilter ? s.show : ""}`}
        onClick={() => setShowFilter(false)}
      />
      <div className={`${s.sidebar} ${showFilter ? s.show_filter : ""}`}>
        <div className={s.header}>
          <h3 className={s.title}>Все фильтры</h3>
          <button className={s.close_btn} onClick={() => setShowFilter(false)}>
            <CloseIcon />
          </button>
        </div>

        <div className={s.block}>
          <div className={s.selecter_wrap}>
              <ClientSearch
                clients={clients}
                onSelect={setSelectedClient}
                text="Клиент"
                disabled={clientsLoading}
              />
          </div>

          <div className={s.selecter_wrap}>
            <MultiSelector
              title="Статус"
              items={statusesList}
              value={selectedStatuses || []}
              onChange={setSelectedStatuses}
              keyField="name"
              labelField="name"
            />
          </div>

          <div className={s.selecter_wrap}>
            <MultiSelector
              title="Исполнитель"
              items={employeesList}
              value={selectedEmployees || []}
              onChange={setSelectedEmployees}
              keyField="id"
              labelField="name"
            />
          </div>
        </div>

        <div className={s.footer}>
          <Button name="Сбросить" color="secondary" onClick={onReset} />
        </div>
      </div>
    </>
  );
};
