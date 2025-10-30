import s from "./CreateTicketPage.module.scss";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "../../UI/Input/Input";
import { Popup } from "../../UI/Popup/Popup";
import { Button } from "../../UI/Button/Button";
import { Selector } from "../../UI/Selector/Selector";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { getClientsForSearch } from "../../api/get/getClientsForSearch";
import { getClientConfigurations } from "../../api/get/getClientConfigurations";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { getEmployees } from "../../api/get/getEmployee";
import { getContacts } from "../../api/get/getContacts";
// import { createTask } from "../../api/create/createTask"; // пока закомментировано

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");

  // State
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(
    Cookies.get("userCode")
  );
  const [userCode] = useState(Cookies.get("userCode"));
  const [loading, setLoading] = useState(true);
  const [configsLoading, setConfigsLoading] = useState(false);

  // Данные формы
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState("");

  // Popup
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  // Загрузка клиентов и сотрудников
  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await getClientsForSearch();
        setClients(clientsData);
        setLoading(false);

        const employeesData = await getEmployees();
        setEmployees(employeesData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
      }
    };

    loadData();
  }, []);

  // Выбор клиента и загрузка его конфигураций
  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    setSelectedConfig("");
    setConfigurations([]);
    setConfigsLoading(true);

    try {
      // 👇 Параллельно грузим конфигурации и контакты
      const [configs, contactsData] = await Promise.all([
        getClientConfigurations(client.code),
        getContacts(client.code),
      ]);

      setConfigurations(Array.isArray(configs) ? configs : []);
      console.log("📇 Контакты клиента:", contactsData);
      // при желании можешь их сохранить в состояние, например:
      // setContactsList(contactsData);
    } catch (error) {
      console.error("Ошибка при загрузке данных клиента:", error);
      setConfigurations([]);
    } finally {
      setConfigsLoading(false);
    }
  };

  // Опции для селекторов
  const configOptions = configurations.map((c, index) => ({
    id: c.id || `conf-${index}`,
    name: c.config || c.name || "Без имени",
  }));

  const employeeOptions = employees.map((e) => ({
    id: e.Code,
    name: e.Name,
  }));

  // Отправка данных с проверкой
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка заполнения всех полей
    if (!title.trim())
      return showValidationPopup("Пожалуйста, заполните заголовок!");
    if (!selectedClient)
      return showValidationPopup("Пожалуйста, выберите клиента!");
    if (!selectedEmployee)
      return showValidationPopup("Пожалуйста, выберите исполнителя!");
    if (!description.trim())
      return showValidationPopup("Пожалуйста, заполните описание задачи!");
    if (!selectedConfig)
      return showValidationPopup("Пожалуйста, выберите конфигурацию!");
    if (!contacts.trim())
      return showValidationPopup("Пожалуйста, заполните контакты!");

    const token = Cookies.get("token");
    const newTicket = {
      token,
      userCode,
      task: {
        clientId: selectedClient.code,
        title: title.trim(),
        description: description.trim(),
        confId: selectedConfig,
        contacts: contacts.trim(),
        owner: selectedEmployee || userCode,
      },
    };

    console.log("📝 Новая заявка:", newTicket);

    // Если нужно отправить на сервер:
    // try {
    //   const response = await createTask(newTicket);
    //   if (response.status === 200) {
    //     console.log("Заявка успешно создана!");
    //   }
    // } catch (err) {
    //   console.error("Ошибка при создании заявки:", err);
    // }
  };

  // Функция для показа попапа с текстом
  const showValidationPopup = (text) => {
    setPopupText(text);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  return (
    <ContentWrapper>
      <PageTitle titleText="Новая заявка" center />
      <Popup showPopup={showPopup} text={popupText} type={false} />

      <form onSubmit={handleSubmit}>
        <Input text="ЗАГОЛОВОК" value={title} setUserData={setTitle} />

        <div className={s.filling_data_inner}>
          <ClientSearch
            clients={clients}
            onSelect={handleSelectClient}
            text="КЛИЕНТ"
            disabled={loading}
          />

          <Selector
            items={employeeOptions}
            value={selectedEmployee}
            title="ИСПОЛНИТЕЛЬ"
            onChange={setSelectedEmployee}
            labelKey="name"
            valueKey="id"
          />
        </div>

        <MultipleInput
          text="ТЕКСТ"
          rows={5}
          value={description}
          setUserData={setDescription}
        />

        <div className={s.filling_data_inner}>
          <Selector
            items={configOptions}
            value={selectedConfig}
            title="КОНФИГУРАЦИЯ"
            onChange={setSelectedConfig}
            disabled={
              !selectedClient || configsLoading || configurations.length === 0
            }
            labelKey="name"
            valueKey="id"
          />

          <Input
            text="КОНТАКТЫ"
            value={contacts}
            setUserData={setContacts}
          />
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
