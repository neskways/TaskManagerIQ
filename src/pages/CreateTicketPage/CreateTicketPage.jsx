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
import { useClients } from "./useClients";


const url = "http://192.168.11.99/iqit/hs/iqit/ClientGetList";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");
  const { clients, loading } = useClients(url);

  const [selectedClient, setSelectedClient] = useState(null);
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
          clients={clients}
          onSelect={(client) => {
            setSelectedClient(client); // теперь это определено
            console.log("Выбран клиент:", client.name, "с кодом:", client.code);
          }}
          text={"КЛИЕНТ"}
        />

        <MultipleInput text={"ТЕКСТ"} />

        <div className={s.filling_data_inner}>
          <Selector
            items={departmentsItems}
            value={selectedDept}
            title={"Конфигурация"}
            onChange={(val) => {
              setSelectedDept(val);
              setSelectedExecutor("");
            }}
          />

          
          <Input text={"КОНТАКТЫ"} />
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
