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
import { taskStatuses } from "../../modules/taskStatuses";
import { useConfigurations } from "./hooks/useConfigurations";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { useClientsAndEmployees } from "./hooks/useClientsAndEmployees";
import { NewContactForm } from "./components/NewContactForm/NewContactForm";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_link_path");
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const role = Cookies.get("role");
  const userCode = Cookies.get("userCode");

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isReturnTask, setIsReturnTask] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [selectedReturnTask, setSelectedReturnTask] = useState("");
  const [isFirstLineTask, setIsFirstLineTask] = useState(
    role === import.meta.env.VITE_TOKEN_DUTY
  );
  const [isDeparture, setIsDeparture] = useState(false);
  const [submitting, setSubmitting] = useState(false); // блокировка

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

  // Автовыбор исполнителя
  useEffect(() => {
    if (!employeeOptions.length) return;
    if (selectedEmployee) return; // не перетирать ручной выбор

    // пробуем найти текущего пользователя
    const currentEmployee = employeeOptions.find(
      (e) => String(e.id) === String(userCode)
    );

    if (currentEmployee) {
      setSelectedEmployee(currentEmployee.id);
    } else {
      // fallback — первый из списка
      setSelectedEmployee(employeeOptions[0].id);
    }
  }, [employeeOptions, userCode, selectedEmployee]);

  // Автовыбор первой конфигурации
  useEffect(() => {
    if (!configsLoading && configOptions.length > 0 && !selectedConfig) {
      setSelectedConfig(configOptions[0].id);
    }
  }, [configsLoading, configOptions]);

  // Автовыбор возвратной задачи
  useEffect(() => {
    if (tasksList.length > 0 && !selectedReturnTask) {
      setSelectedReturnTask(tasksList[0].id);
    }
  }, [tasksList]);

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
          userCode,
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
  }, [isReturnTask, selectedClient, showPopup, userCode]);

  useEffect(() => {
    if (!selectedClient) {
      setIsReturnTask(false);
      setSelectedReturnTask("");
    }
  }, [selectedClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const showValidationPopup = (text) => showPopup(text, { type: "error" });

    if (!title.trim())
      return showValidationPopup("Пожалуйста, заполните заголовок!");
    if (!selectedClient)
      return showValidationPopup("Пожалуйста, выберите клиента!");
    if (!selectedEmployee)
      return showValidationPopup("Пожалуйста, выберите исполнителя!");
    if (!selectedConfig)
      return showValidationPopup("Пожалуйста, выберите конфигурацию!");
    if (!description.trim())
      return showValidationPopup("Пожалуйста, заполните описание задачи!");

    if (!selectedContactId && !creatingNewContact)
      return showValidationPopup("Пожалуйста, выберите контакт!");

    if (creatingNewContact) {
      if (!contactDetails.name.trim())
        return showValidationPopup(
          "Пожалуйста, заполните ФИО нового контакта!"
        );
      if (!contactDetails.phone.trim())
        return showValidationPopup(
          "Пожалуйста, заполните номер телефона нового контакта!"
        );
      const phoneRegex = /^\+7\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
      if (!phoneRegex.test(contactDetails.phone.trim()))
        return showValidationPopup(
          "Введите номер телефона в формате +7(XXX) XXX-XX-XX"
        );
    }

    if (isReturnTask && !selectedReturnTask)
      return showValidationPopup("Пожалуйста, выберите возвратную задачу!");

    try {
      setSubmitting(true);

      const payload = {
        token: Cookies.get("token"),
        userId: userCode,
        task: {
          clientId: selectedClient.code,
          title: title.trim(),
          description: description.trim(),
          confId: selectedConfig,
          contacts: { ...contactDetails },
          owner: selectedEmployee,
          return: isReturnTask ? selectedReturnTask : null,
          firstline:
            role === import.meta.env.VITE_TOKEN_DUTY
              ? "true"
              : isFirstLineTask
              ? "true"
              : null,
          departure: isDeparture ? "true" : "false",
        },
      };

      let result = await createTask(payload);
      if (typeof result === "string") {
        result = JSON.parse(result.replace(/'/g, '"'));
      }
      if (result?.Error) {
        showPopup(`Ошибка: ${result.Error}`, { type: "error" });
        return;
      }

      const cleanId = parseInt(result.taskid, 10);
      showPopup(MESSAGES.createTaskSuccess, { type: "success" });
      setTimeout(() => navigate(`/tasks/all_tickets?open=${cleanId}`), 50);
    } catch (error) {
      console.error("Ошибка при создании заявки:", error);
      showPopup(MESSAGES.createTaskError, { type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ContentWrapper reletive={true}>
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
          text="Текст"
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
            emptyLabel="Конфигурация не выбрана"
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

        <div className={s.additional_parameters}>
          {role === import.meta.env.VITE_TOKEN_MANAGER && (
            <>
              <div className={s.checkbox}>
                <Checkbox
                  checked={isFirstLineTask}
                  onChange={(e) => setIsFirstLineTask(e.target.checked)}
                  disabled={role === import.meta.env.VITE_TOKEN_DUTY}
                />
                <p>Задача первой линии</p>
              </div>

              <div className={s.checkbox}>
                <Checkbox
                  checked={isDeparture}
                  onChange={(e) => setIsDeparture(e.target.checked)}
                  disabled={role === import.meta.env.VITE_TOKEN_DUTY}
                />
                <p>Выезд к клиенту</p>
              </div>
            </>
          )}

          <div className={s.return_task}>
            <div className={s.checkbox}>
              <Checkbox
                checked={isReturnTask}
                onChange={(e) => setIsReturnTask(e.target.checked)}
                disabled={!selectedClient}
                disabledTitle="Сначала выберите клиента!"
              />
              <p>Возврат к задаче</p>
            </div>

            {isReturnTask && (
              <Selector
                items={tasksList}
                value={selectedReturnTask}
                onChange={setSelectedReturnTask}
                disabled={tasksList.length === 0}
                labelKey="name"
                valueKey="id"
              />
            )}
          </div>
        </div>

        <div className={s.button_wrap}>
          <Button name="Создать" type="submit" disabled={submitting} />
        </div>

        <Link to={lastSecondaryPath} className={s.return_button}>
          Отмена и возврат
        </Link>
      </form>
    </ContentWrapper>
  );
};
