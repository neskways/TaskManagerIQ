import { useState, useEffect } from "react";
import { getContacts } from "../../../api/get/getContacts";

export const useContacts = (client) => {
  const [contactsList, setContactsList] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState("");
  const [creatingNewContact, setCreatingNewContact] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    n: "",
    name: "",
    post: "",
    phone: "",
    mail: "",
  });

  useEffect(() => {
    if (!client) {
      setContactsList([]);
      setSelectedContactId("");
      setCreatingNewContact(false);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
      return;
    }

    const loadContacts = async () => {
      try {
        const data = await getContacts(client.code);
        setContactsList(Array.isArray(data) ? data : []);
        setSelectedContactId("");
        setCreatingNewContact(false);
        setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
      } catch (err) {
        console.error("Ошибка при загрузке контактов:", err);
        setContactsList([]);
      }
    };

    loadContacts();
  }, [client]);

  const contactOptions = [
    ...contactsList.map((c) => {
      const parts = [];
      if (c.name) parts.push(c.name);
      if (c.post) parts.push(c.post);
      if (c.phone) parts.push(c.phone);
      if (c.mail) parts.push(c.mail);

      return {
        id: String(c.id),
        name: parts.join(" | "), // соединяем только существующие поля
        data: c,
      };
    }),
    { id: "new", name: "Создать новый контакт" },
  ];

  const handleSelectContact = (id) => {
    setSelectedContactId(id);

    if (id === "") {
      setCreatingNewContact(false);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
    } else if (id === "new") {
      setCreatingNewContact(true);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
    } else {
      setCreatingNewContact(false);
      const contact = contactsList.find((c) => String(c.id) === id);
      if (contact) {
        setContactDetails({
          n: contact.id,
          name: contact.name,
          post: contact.post,
          phone: contact.phone,
          mail: contact.mail,
        });
      }
    }
  };

  return {
    contactsList,
    contactOptions,
    selectedContactId,
    creatingNewContact,
    contactDetails,
    setContactDetails,
    handleSelectContact,
  };
};
