import s from "./Contacts.module.scss";

export const Contacts = ({ contacts }) => {

  if (contacts.name === "" && contacts.post === "" && contacts.phone === "" && contacts.mail === "") {
    return (
      <div className={s.block}>
        <h4 className={s.title}>Контакты</h4>
        <p className={s.no}>Нет контактов</p>
      </div>
    );
  }

  return (
    <div className={s.block}>
      <h4 className={s.title}>Контакты</h4>
      {contacts.name && <p className={s.text}>{contacts.name}</p>}
      {contacts.post && <p className={s.text}>{contacts.post}</p>}
      {contacts.phone && <p className={s.text}>{contacts.phone}</p>}
      {contacts.mail && <p className={s.text}>{contacts.mail}</p>}
    </div>
  );
};
