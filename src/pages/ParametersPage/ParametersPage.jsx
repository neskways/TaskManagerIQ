import s from "./ParametersPage.module.scss";
import { ThemeToggle } from "../../UI/ThemeToggle/ThemeToggle";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { DeleteButton } from "../../UI/DeleteButton/DeleteButton";

export const ParametersPage = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"Параметры"} center={true} /> 
        <div className={s.parameters_block}>
          <h4 className={s.parameters_title}>Внешний вид</h4>
          <div className={s.parameters_item}>
            <span>Изменить тему</span> <ThemeToggle />
          </div>
        </div>
        <div className={s.parameters_block}>
          <h4 className={s.parameters_title}>Настройка списка</h4>
          <div className={s.parameters_item}></div>
        </div>
        <div className={s.parameters_block}>
          <h4 className={s.parameters_title}>Кэша приложения</h4>
          <div className={s.parameters_item}>
            <div className={s.parameters_item}>
              <span>Очистить кэш</span>
              <DeleteButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
