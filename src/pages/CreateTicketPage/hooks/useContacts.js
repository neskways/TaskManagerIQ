import { useState, useEffect } from "react";
import { getContacts } from "../../../api/get/getContacts";

export const useContacts = (client) => {
  const [contactsList, setContactsList] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
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
      setContactOptions([]);
      setSelectedContactId("");
      setCreatingNewContact(false);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
      return;
    }

    const loadContacts = async () => {
      try {
        const data = await getContacts(client.code);
        const list = Array.isArray(data) ? data : [];

        setContactsList(list);

        const opts = list.map((c) => ({
          id: String(c.id),
          name: [
            c.phone,
            c.name,
            c.post,
            c.mail,
          ]
            .filter(Boolean)
            .join(" | "),
          data: c,
        }));

        setContactOptions([...opts, { id: "new", name: "Создать новый контакт" }]);

        if (list.length > 0) {
          const first = list[0];
          setSelectedContactId(String(first.id));
          setContactDetails({
            n: first.id,
            name: first.name,
            post: first.post,
            phone: first.phone,
            mail: first.mail,
          });
          setCreatingNewContact(false);
        } else {
          setSelectedContactId("");
          setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
          setCreatingNewContact(false);
        }
      } catch (err) {
        console.error("Ошибка при загрузке контактов:", err);
        setContactsList([]);
        setContactOptions([]);
        setSelectedContactId("");
        setCreatingNewContact(false);
        setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
      }
    };

    loadContacts();
  }, [client]);

  const handleSelectContact = (id) => {
    setSelectedContactId(id);

    if (id === "" || id === null) {
      setCreatingNewContact(false);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
    } else if (id === "new") {
      setCreatingNewContact(true);
      setContactDetails({ n: "", name: "", post: "", phone: "", mail: "" });
    } else {
      setCreatingNewContact(false);
      const c = contactsList.find((x) => String(x.id) === id);
      if (c) {
        setContactDetails({
          n: c.id,
          name: c.name,
          post: c.post,
          phone: c.phone,
          mail: c.mail,
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
