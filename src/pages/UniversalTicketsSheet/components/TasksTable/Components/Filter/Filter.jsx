import s from "./Filter.module.scss";
import { useEffect, useState } from "react";
import { Button } from "../../../../../../UI/Button/Button";
import { MultiSelector } from "../../../../../../UI/MultiSelector/MultiSelector";
import { getEmployees } from "../../../../../../api/get/getEmployee";
import { ClientSearch } from "../../../../../CreateTicketPage/components/ClientSearch/ClientSearch";
import { statusesList } from "../../../../../../modules/taskStatuses";

export const Filter = ({
  showFilter,
  selectedStatuses,
  setSelectedStatuses,
  selectedEmployees,
  setSelectedEmployees,
  clients = [],
  clientsLoading = false,
  selectedClient,
  setSelectedClient,
  onReset,
}) => {
  const [employeesList, setEmployeesList] = useState([]);

  useEffect(() => {
    getEmployees().then((data) => {
      const list = data.map((emp) => ({
        id: emp.Name,
        name: emp.Name,
      }));

      setEmployeesList(list);
    });
  }, []);

  return (
    <div className={`${s.filterWrapper} ${showFilter ? s.open : ""}`}>
      <div className={s.row}>
        <div className={s.field}>
          <ClientSearch
            clients={clients}
            onSelect={setSelectedClient}
            disabled={clientsLoading}
            smallStyle={true}
            value={selectedClient}  
            hide={true}
          />
        </div>

        <div className={s.field}>
          <MultiSelector
            title="Статус"
            items={statusesList}
            value={selectedStatuses || []}
            onChange={setSelectedStatuses}
            keyField="name"
            labelField="name"
            smallStyle={true}
            showTitle={false}
          />
        </div>

        <div className={s.field}>
          <MultiSelector
            title="Исполнитель"
            items={employeesList}
            value={selectedEmployees || []}
            onChange={setSelectedEmployees}
            keyField="id"
            labelField="name"
            smallStyle={true}
            showTitle={false}
          />
        </div>

        <div className={s.reset}>
          <Button
            name="R"
            color="red"
            onClick={onReset}
          />
        </div>
      </div>
    </div>
  );
};