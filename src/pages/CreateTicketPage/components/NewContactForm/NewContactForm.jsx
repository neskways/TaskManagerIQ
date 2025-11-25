import s from "./NewContactForm.module.scss";
import { Input } from "../../../../UI/Input/Input";

export const NewContactForm = ({ contactDetails, setContactDetails }) => {
  return (
    <div className={s.wrapper}>
      <Input
        text="ФИО"
        value={contactDetails.name}
        setUserData={(v) => setContactDetails({ ...contactDetails, name: v })}
      />
      <Input
        text="Должность"
        value={contactDetails.post}
        setUserData={(v) => setContactDetails({ ...contactDetails, post: v })}
      />
      <Input
        text="Телефон"
        type={"tel"}
        pattern="^\+7\(\d{3}\)\s\d{3}-\d{2}-\d{2}$"
        placeholder="+7(900) 000-00-00"
        maxLen={17}
        value={contactDetails.phone}
        setUserData={(v) => {
          setContactDetails({ ...contactDetails, phone: v })
        }}
      />
      <Input
        text="Email"
        type={"email"}
        value={contactDetails.mail}
        setUserData={(v) => setContactDetails({ ...contactDetails, mail: v })}
      />
    </div>
  );
};
