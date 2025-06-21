import s from "./KnowledgeBase.module.scss";s
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";

export const KnowledgeBase = () => {
  
  return (
    <div className={s.wrapper}>
      <PageTitle titleText={"База знаний"} />
      <WorkImg/>
    </div>
  );
};
