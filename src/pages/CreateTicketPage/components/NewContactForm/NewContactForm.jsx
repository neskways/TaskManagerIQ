import s from "./NewContactForm.module.scss";
import { Input } from "../../../../UI/Input/Input";
import PhoneInput from "./components/PhoneInput";

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

      <PhoneInput
        value={contactDetails.phone || ""}
        onChange={(formatted) =>
          setContactDetails({ ...contactDetails, phone: formatted })
        }
        text="Телефон"
      />

      <Input
        text="Email"
        type="email"
        value={contactDetails.mail}
        setUserData={(v) => setContactDetails({ ...contactDetails, mail: v })}
      />
    </div>
  );
};
