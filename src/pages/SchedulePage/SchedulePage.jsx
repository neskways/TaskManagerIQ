import { Calendar } from "../../components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import s from "./SchedulePage.module.scss";

export const SchedulePage = () => {
  return (
    <div className={s.wrapper}>
      <PageTitle titleText={"График дежурст и обновлений"} />
      <Calendar />
    </div>
  );
}
