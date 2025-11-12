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
            <span className={s.span}>{contacts.name}</span> 
          </div>
        )}
        {contacts.post && (
          <div className={s.text}>
            <span className={s.span}>{contacts.post}</span> 
          </div>
        )}
        {contacts.phone && (
          <div className={s.text}>
            <span className={s.span}>{contacts.phone}</span> 
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
