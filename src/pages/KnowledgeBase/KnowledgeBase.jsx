import s from "./KnowledgeBase.module.scss";
import { WorkImg } from "../../components/WorkImg/WorkImg";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const KnowledgeBase = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText={"База знаний"} center={true} />
      <WorkImg />
    </ContentWrapper>
  );
};
