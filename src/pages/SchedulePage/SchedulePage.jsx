import { Calendar } from "../../components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import s from "./SchedulePage.module.scss";

export const SchedulePage = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"График дежурст и обновлений"} center={true} />
        <Calendar />
      </div>
    </div>
  );
}
