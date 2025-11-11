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

  // 🔹 Загружаем возвратные задачи, если выбран клиент и включён чекбокс
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
          selectedClient.code // фильтр по клиенту
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

  // 🔹 Сбрасываем чекбокс, если клиент снимается
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
    if (!contactDetails.name.trim())
      return showValidationPopup("Пожалуйста, заполните контакт!");
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
        firstline:
          (role === import.meta.env.VITE_TOKEN_DUTE ||
          role === import.meta.env.VITE_TOKEN_MANAGER)
            ? "true"
            : null,
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
        <Input text="ЗАГОЛОВОК" value={title} setUserData={setTitle} />

        <div className={s.filling_data_inner}>
          <ClientSearch
            clients={clients}
            onSelect={setSelectedClient}
            text="КЛИЕНТ"
            disabled={clientsLoading}
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
          rows={6}
          value={description}
          setUserData={setDescription}
        />

        <div className={s.filling_data_inner_2}>
          <Selector
            items={configOptions}
            value={selectedConfig}
            title="КОНФИГУРАЦИЯ"
            onChange={setSelectedConfig}
            disabled={!selectedClient || !dataReady}
            labelKey="name"
            valueKey="id"
          />

          <Selector
            items={contactOptions}
            value={selectedContactId}
            title="КОНТАКТЫ"
            onChange={handleSelectContact}
            disabled={!selectedClient || !dataReady}
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

        {/* --- Возврат к задаче --- */}
        <div className={s.return_task}>
          <div className={s.checkbox}>
            <Checkbox
              checked={isReturnTask}
              onChange={(e) => setIsReturnTask(e.target.checked)}
              disabled={!selectedClient} // 🔹 недоступно, пока клиент не выбран
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
