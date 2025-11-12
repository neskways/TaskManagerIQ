import s from "./CreateTicketPage.module.scss";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { useContacts } from "./hooks/useContacts";
import { MESSAGES } from "../../modules/messages";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "../../context/PopupContext";
import { Checkbox } from "../../UI/Checkbox/Checkbox";
import { Selector } from "../../UI/Selector/Selector";
import { createTask } from "../../api/create/createTask";
import { getTasksList } from "../../api/get/getTasksList";
import { taskStatuses } from "../../modules/TaskStatuses";
import { useConfigurations } from "./hooks/useConfigurations";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { useClientsAndEmployees } from "./hooks/useClientsAndEmployees";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { NewContactForm } from "./components/NewContactForm/NewContactForm";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_link_path");
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(
    Cookies.get("userCode")
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isReturnTask, setIsReturnTask] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [selectedReturnTask, setSelectedReturnTask] = useState("");

  const {
    clients,
    employeeOptions,
    loading: clientsLoading,
  } = useClientsAndEmployees();

  const {
    contactOptions,
    selectedContactId,
    creatingNewContact,
    contactDetails,
    setContactDetails,
    handleSelectContact,
  } = useContacts(selectedClient);

  const {
    configOptions,
    selectedConfig,
    setSelectedConfig,
    loading: configsLoading,
  } = useConfigurations(selectedClient);

  const dataReady =
    !configsLoading && configOptions.length > 0 && contactOptions.length > 0;

  useEffect(() => {
    const loadTasks = async () => {
      if (!selectedClient || !isReturnTask) {
        setTasksList([]);
        setSelectedReturnTask("");
        return;
      }

      try {
        const tasks = await getTasksList(
          [taskStatuses.DONE.code],
          Cookies.get("userCode"),
          null,
          null,
          selectedClient.code 
        );

        const mapped = tasks.map((t) => ({
          id: t.number,
          name: `${t.title} (${t.client})`,
        }));
        setTasksList(mapped);
      } catch (error) {
        console.error("Ошибка при загрузке возвратных задач:", error);
        showPopup("Не удалось загрузить завершённые задачи", { type: "error" });
      }
    };

    loadTasks();
  }, [isReturnTask, selectedClient, showPopup]);


  useEffect(() => {
    if (!selectedClient) {
      setIsReturnTask(false);
      setSelectedReturnTask("");
    }
  }, [selectedClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const showValidationPopup = (text) => showPopup(text, { type: "error" });

    if (!title.trim())
      return showValidationPopup("Пожалуйста, заполните заголовок!");
    if (!selectedClient)
      return showValidationPopup("Пожалуйста, выберите клиента!");
    if (!selectedEmployee)
      return showValidationPopup("Пожалуйста, выберите исполнителя!");
    if (!description.trim())
      return showValidationPopup("Пожалуйста, заполните описание задачи!");

    if (creatingNewContact) {
      if (!contactDetails.name.trim())
        return showValidationPopup(
          "Пожалуйста, заполните ФИО нового контакта!"
        );
      if (!contactDetails.phone.trim())
        return showValidationPopup(
          "Пожалуйста, заполните номер телефона нового контакта!"
        );
    } else {
      if (!contactDetails.name.trim())
        return showValidationPopup("Пожалуйста, выберите контакт!");
    }

    if (!selectedReturnTask && isReturnTask)
      return showValidationPopup("Пожалуйста, выберите возвратную задачу!");

    const token = Cookies.get("token");
    const userCode = Cookies.get("userCode");
    const role = Cookies.get("role");

    const payload = {
      token,
      userId: userCode,
      task: {
        clientId: selectedClient.code,
        title: title.trim(),
        description: description.trim(),
        confId: selectedConfig || null,
        contacts: { ...contactDetails },
        owner: selectedEmployee || userCode,
        return: isReturnTask ? selectedReturnTask : null,
        firstline: role === import.meta.env.VITE_TOKEN_DUTY ? "true" : null,
      },
    };

    try {
      let result = await createTask(payload);
      if (typeof result === "string") {
        result = JSON.parse(result.replace(/'/g, '"'));
      }

      if (result?.Error) {
        return showPopup(`Ошибка: ${result.Error}`, { type: "error" });
      }

      const cleanId = parseInt(result.taskid, 10);
      showPopup(MESSAGES.createTaskSuccess, { type: "success" });
      setTimeout(() => navigate(`/ticket/${cleanId}`), 100);
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
      showPopup(MESSAGES.createTaskError, { type: "error" });
    }
  };

  return (
    <ContentWrapper>
      <PageTitle titleText="Новая заявка" center />

      <form onSubmit={handleSubmit}>
        <Input text="Заголовок" value={title} setUserData={setTitle} />

        <div className={s.filling_data_inner}>
          <ClientSearch
            clients={clients}
            onSelect={setSelectedClient}
            text="Клиент"
            disabled={clientsLoading}
          />

          <Selector
            items={employeeOptions}
            value={selectedEmployee}
            title="Исполнитель"
            onChange={setSelectedEmployee}
            labelKey="name"
            valueKey="id"
          />
        </div>

        <MultipleInput
          text="ТЕКСТ"
          rows={6}
          value={description}
          setUserData={setDescription}
        />

        <div className={s.filling_data_inner_2}>
          <Selector
            items={configOptions}
            value={selectedConfig}
            title="Конфигурации"
            onChange={setSelectedConfig}
            disabled={!selectedClient || configsLoading}
            labelKey="displayName"
            valueKey="id"
          />

          <Selector
            items={contactOptions}
            value={selectedContactId}
            title="Контакты"
            onChange={handleSelectContact}
            disabled={!selectedClient}
            labelKey="name"
            valueKey="id"
          />
        </div>

        {creatingNewContact && (
          <NewContactForm
            contactDetails={contactDetails}
            setContactDetails={setContactDetails}
          />
        )}

        <div className={s.return_task}>
          <div className={s.checkbox}>
            <Checkbox
              checked={isReturnTask}
              onChange={(e) => setIsReturnTask(e.target.checked)}
              disabled={!selectedClient}
            />
            <p>Возврат к задаче</p>
          </div>

          {isReturnTask && (
            <Selector
              items={tasksList}
              value={selectedReturnTask}
              onChange={setSelectedReturnTask}
              labelKey="name"
              valueKey="id"
              disabled={tasksList.length === 0}
            />
          )}
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
