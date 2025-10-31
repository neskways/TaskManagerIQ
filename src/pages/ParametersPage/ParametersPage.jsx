import s from "./ParametersPage.module.scss";
import Cookies from "js-cookie";
import { ThemeToggle } from "../../UI/ThemeToggle/ThemeToggle";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { DeleteButton } from "../../UI/DeleteButton/DeleteButton";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { SecretSettingsBlock } from "./components/SecretSettingsBlock/SecretSettingsBlock";

export const ParametersPage = () => {

  const role = Cookies.get("role");

  return (
    <ContentWrapper>
      <PageTitle titleText={"Параметры"} center={true} />
      <div className={s.parameters_block}>
        <h4 className={s.parameters_title}>Внешний вид</h4>
        <div className={s.parameters_item}>
          <span>Изменить тему</span> <ThemeToggle />
        </div>
      </div>

      {role !== import.meta.env.VITE_TOKEN_MANAGER && (
        <div className={s.parameters_block}>
          <h4 className={s.parameters_title}>Настройка пасхалок</h4>
          <div className={s.parameters_item}>
            <SecretSettingsBlock />
          </div>
        </div>
      )}

      <div className={s.parameters_block}>
        <h4 className={s.parameters_title}>Кэша приложения</h4>
        <div className={s.parameters_item}>
          <div className={s.parameters_item}>
            <span>Очистить кэш</span>
            <DeleteButton />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};
