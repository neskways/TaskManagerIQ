import s from "./KnowledgeBase.module.scss";
import { WorkImg } from "../../components/WorkImg/WorkImg";

export const KnowledgeBase = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <h2 className={s.title}>База знаний</h2>
        <WorkImg />
      </div>
    </div>
  );
};
