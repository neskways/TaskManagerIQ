import s from "./CreateTicketPage.module.scss";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { Selector } from "../../UI/Selector/Selector";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { getClientsForSearch } from "../../api/getClientsForSearch";
import { getClientConfigurations } from "../../api/getClientConfigurations";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { departmentsItems, executorsItems } from "../../modules/Arrays";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [configurations, setConfigurations] = useState([]); // 🔹 Конфигурации клиента
  const [selectedConfig, setSelectedConfig] = useState(""); // 🔹 выбранная конфигурация
  const [loading, setLoading] = useState(true);

  const role = Cookies.get("role");
  const showIspol = role === "Дежурный" || role === "Руководитель";

  // Загружаем список клиентов
  useEffect(() => {
    const loadClients = async () => {
      const data = await getClientsForSearch();
      setClients(data);
      setLoading(false);
    };
    loadClients();
  }, []);

  // Когда выбираем клиента — запрашиваем конфигурации
  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    setSelectedConfig("");
    setConfigurations([]); // очищаем старые

    console.log("Выбран клиент:", client);
    const configs = await getClientConfigurations(client.code);
    console.log("Конфигурации клиента:", configs);
    setConfigurations(configs);
  };

  const filteredExecutors = selectedDept
    ? executorsItems.filter((ex) => ex.department === Number(selectedDept))
    : [];

  return (
    <ContentWrapper>
      <PageTitle titleText="Новая заявка" center />
      <form>
        <Input text="ЗАГОЛОВОК" />

        <div
          className={`${s.filling_data_inner} ${showIspol ? "" : s.disable}`}
        >
          <ClientSearch
            clients={clients}
            onSelect={handleSelectClient}
            text="КЛИЕНТ"
            disabled={loading}
          />

          {showIspol && (
            <Selector
              items={departmentsItems}
              value={selectedDept}
              title="ИСПОЛНИТЕЛЬ"
              onChange={(val) => {
                setSelectedDept(val);
                setSelectedExecutor("");
              }}
            />
          )}
        </div>

        <MultipleInput text="ТЕКСТ" rows={5} />

        <div className={s.filling_data_inner}>
          <Selector
            items={configurations.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
            value={selectedConfig}
            title="КОНФИГУРАЦИЯ"
            onChange={setSelectedConfig}
          />

          <Input text="КОНТАКТЫ" placeholder="+7 999 666 99 99" />
        </div>

        <div className={s.button_wrap}>
          <Button name="Создать" type="submit" />
        </div>

        <Link to={lastSecondaryPath} className={s.return_button}>
          Отмена и возврат
        </Link>
      </form>
    </ContentWrapper>
  );
};
