import s from "./Contacts.module.scss";

export const Contacts = ({ contacts }) => {
  if (
    contacts.name === "" &&
    contacts.post === "" &&
    contacts.phone === "" &&
    contacts.mail === ""
  ) {
    return (
      <div className={s.block}>
        <h4 className={s.title}>Контакты</h4>
        <div className={s.text_block}>
          <p className={s.no}>Нет контактов</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.block}>
      <h4 className={s.title}>Контакты</h4>
      <div className={s.text_block}>
        {contacts.name && (
          <div className={s.text}>
            <span className={s.span}>ФИО:</span> {contacts.name}
          </div>
        )}
        {contacts.post && (
          <div className={s.text}>
            <span className={s.span}>Должность:</span> {contacts.post}
          </div>
        )}
        {contacts.phone && (
          <div className={s.text}>
            <span className={s.span}>Телефон:</span> {contacts.phone}
          </div>
        )}
        {contacts.mail && (
          <div className={s.text}>
            <span className={s.span}>Почта:</span> {contacts.mail}
          </div>
        )}
      </div>
    </div>
  );
};
