import s from "./CreateTicketPage.module.scss";
import { Link } from "react-router-dom";
import { Input } from '../../UI/Input/Input'
import { Button } from "../../UI/Button/Button";
import { Selector } from "../../UI/Selector/Selector";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { departmentsItems, prioritiesItems, stateTaskItems } from "../../modules/Arrays";

export const CreateTicketPage = () => {

 const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"Новая заявка"} center={true} /> 
        <form action="">
          <Input text={"ЗАГОЛОВОК"} />
        <Input text={"КЛИЕНТ"} />
        <MultipleInput text={"ТЕКСТ"} />
        
        <div className={s.filling_data_inner}>
          <Selector items={departmentsItems} defaultValue={1} title={"ОТДЕЛ"} />
          <Selector items={departmentsItems} defaultValue={1} title={"ИСПОЛНИТЕЛЬ"} />
        </div>
         <div className={s.filling_data_inner}>
          <Selector items={stateTaskItems}  defaultValue={1} title={"СОСТОЯНИЕ"} />
          <Selector items={prioritiesItems}  defaultValue={2} title={"ПРИОРИТЕТ"} />
        </div>
        <div className={s.button_wrap}>
           <Button name={"Создать"} type="submit" />
        </div>

        <Link to={lastSecondaryPath} className={s.return_button}>
          Отмена и возврат
        </Link>
        </form>
      </div>
    </div>
  );
};
