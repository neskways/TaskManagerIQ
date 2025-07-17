import s from "./StatisticsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";

export const StatisticsPage = () => {
  return (
     <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"Статистика"} center={true} /> 
        <WorkImg />
      </div>
    </div>
  );
}
