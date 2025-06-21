import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import s from "./StatisticsPage.module.scss";

export const StatisticsPage = () => {
  return (
    <div className={s.wrapper}>
        <PageTitle titleText={"Статистика"} /> 
        <WorkImg />
    </div>
  );
}
