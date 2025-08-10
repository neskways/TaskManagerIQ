import s from "./CreateTicketPage.module.scss";
import { Link } from "react-router-dom";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Selector } from "../../UI/Selector/Selector";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { useState } from "react";
import {
  departmentsItems,
  prioritiesItems,
  stateTaskItems,
  executorsItems,
  clientsItems,
} from "../../modules/Arrays";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";

export const CreateTicketPage = () => {

  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");

 const [selectedDept, setSelectedDept] = useState("");
  const [selectedExecutor, setSelectedExecutor] = useState("");

  const filteredExecutors = selectedDept
    ? executorsItems.filter((ex) => ex.department === Number(selectedDept))
    : [];

  return (
    <ContentWrapper>
      <PageTitle titleText={"Новая заявка"} center />
      <form>
        <Input text={"ЗАГОЛОВОК"} />

        <ClientSearch
          clients={clientsItems}
          onSelect={(client) => setSelectedClient(client)}
          text={"КЛИЕНТ"}
        />

        <MultipleInput text={"ТЕКСТ"} />

        <div className={s.filling_data_inner}>
          <Selector
            items={departmentsItems}
            value={selectedDept}
            title={"ОТДЕЛ"}
            onChange={(val) => {
              setSelectedDept(val);
              setSelectedExecutor(""); // сброс исполнителя при смене отдела
            }}
          />

          <Selector
            items={filteredExecutors}
            value={selectedExecutor}
            title={"ИСПОЛНИТЕЛЬ"}
            labelKey="fio"
            onChange={setSelectedExecutor}
            disabled={!selectedDept}
          />
        </div>

        <div className={s.filling_data_inner}>
          <Selector
            items={stateTaskItems}
            defaultValue={1}
            title={"СОСТОЯНИЕ"}
          />
          <Selector
            items={prioritiesItems}
            defaultValue={2}
            title={"ПРИОРИТЕТ"}
          />
        </div>

        <div className={s.button_wrap}>
          <Button name={"Создать"} type="submit" />
        </div>

        <Link to={lastSecondaryPath} className={s.return_button}>
          Отмена и возврат
        </Link>
      </form>
    </ContentWrapper>
  );
};
