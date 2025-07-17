import s from "./KnowledgeBase.module.scss";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import { PageTitle } from "../../components/PageTitle/PageTitle";

export const KnowledgeBase = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <PageTitle titleText={"База знаний"} center={true} /> 
        <WorkImg />
      </div>
    </div>
  );
};
