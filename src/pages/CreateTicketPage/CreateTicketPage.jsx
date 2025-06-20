import s from "./CreateTicketPage.module.scss";
import { Input } from '../../UI/Input/Input'
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { Selector } from "../../UI/Selector/Selector";
import { departmentsItems, prioritiesItems } from "../../modules/Arrays";

export const CreateTicketPage = () => {

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h2 className={s.title}>Новая заявка</h2>
        <Input text={"ЗАГОЛОВОК *"} />
        <Input text={"КЛИЕНТ *"} />
        <MultipleInput text={"ТЕКСТ"} />
        
        <div className={s.filling_data_inner}>
          <Selector items={prioritiesItems}  defaultValue={2} />
          <Selector items={departmentsItems} defaultValue={1} />
        </div>
      </div>
    </div>
  );
};
