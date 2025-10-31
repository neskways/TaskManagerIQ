import s from "./CreateTicketPage.module.scss";
import Cookies from "js-cookie";
import { useState } from "react";
import { Input } from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import { useContacts } from "./hooks/useContacts";
import { Link, useNavigate } from "react-router-dom";
import { usePopup } from "../../context/PopupContext";
import { Selector } from "../../UI/Selector/Selector";
import { createTask } from "../../api/create/createTask";
import { useConfigurations } from "./hooks/useConfigurations";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { useClientsAndEmployees } from "./hooks/useClientsAndEmployees";
import { ClientSearch } from "./components/ClientSearch/ClientSearch";
import { NewContactForm } from "./components/NewContactForm/NewContactForm";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const CreateTicketPage = () => {
  const lastSecondaryPath = getFromLocalStorage("last_link_path");
  const navigate = useNavigate();

  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(
    Cookies.get("userCode")
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { showPopup } = usePopup();

  // Хуки
  const { clients, employeeOptions, loading: clientsLoading } = useClientsAndEmployees();
  const {
    contactOptions,
    selectedContactId,
    creatingNewContact,
    contactDetails,
    setContactDetails,
    handleSelectContact,
  } = useContacts(selectedClient);
  const { configOptions, selectedConfig, setSelectedConfig, loading: configsLoading } =
    useConfigurations(selectedClient);

  const dataReady = !configsLoading && configOptions.length > 0 && contactOptions.length > 0;

  const showValidationPopup = (text) => {
    showPopup(text, { type: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация
    if (!title.trim()) return showValidationPopup("Пожалуйста, заполните заголовок!");
    if (!selectedClient) return showValidationPopup("Пожалуйста, выберите клиента!");
    if (!selectedEmployee) return showValidationPopup("Пожалуйста, выберите исполнителя!");
    if (!description.trim()) return showValidationPopup("Пожалуйста, заполните описание задачи!");
    if (!selectedConfig) return showValidationPopup("Пожалуйста, выберите конфигурацию!");
    if (!contactDetails.name.trim()) return showValidationPopup("Пожалуйста, заполните контакт!");

    const token = Cookies.get("token");
    const userCode = Cookies.get("userCode");

    const payload = {
      token,
      userId: userCode,
      task: {
        clientId: selectedClient.code,
        title: title.trim(),
        description: description.trim(),
        confId: selectedConfig,
        contacts: { ...contactDetails },
        owner: selectedEmployee || userCode,
      },
    };

    try {
      let result = await createTask(payload);

      // Если приходит строка — парсим её
      if (typeof result === "string") {
        const fixed = result.replace(/'/g, '"');
        result = JSON.parse(fixed);
      }

      if (result?.Error) {
        showPopup(`Ошибка: ${result.Error}`, { type: false });
        return;
      }

      const cleanId = parseInt(result.taskid, 10);

      showPopup("Заявка успешно создана!", { type: true });

      setTimeout(() => {
        navigate(`/ticket/${cleanId}`);
      }, 100);
    } catch (error) {
      console.error(error);
      showPopup("Не удалось создать заявку, попробуйте позже.", { type: false });
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

        <div className={s.filling_data_inner}>
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
