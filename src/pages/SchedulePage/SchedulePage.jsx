import { Calendar } from "../../components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import s from "./SchedulePage.module.scss";

export const SchedulePage = () => {
  return (
    <div className={s.wrapper}>
      <Calendar />
    </div>
  );
}
