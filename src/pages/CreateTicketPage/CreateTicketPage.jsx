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
  executorsItems
} from "../../modules/Arrays";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { useClients } from "./useClients";
import { getClients } from "../../api/getClients";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");
  const { clients, showPopup } = getClients();

  const [selectedClient,   setSelectedClient] = useState(null);
  const [selectedDept,     setSelectedDept] = useState("");
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

        <MultipleInput text={"ТЕКСТ"} rows={5} />

        <div className={s.filling_data_inner}>
          <Selector
            items={departmentsItems}
            value={selectedDept}
            title={"КОНФИГУРАЦИЯ"}
            onChange={(val) => {
              setSelectedDept(val);
              setSelectedExecutor("");
            }}
          />

          
          <Input text={"КОНТАКТЫ"} placeholder={"+7 999 666 99 99"} />
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
