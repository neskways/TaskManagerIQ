import { PageTitle } from "../../components/PageTitle/PageTitle";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import s from "./KnowledgeBase.module.scss";

export const KnowledgeBase = () => {
  
  return (
    <div>
      <PageTitle titleText={"База знаний"} />
      <WorkImg/>
    </div>
  );
};
