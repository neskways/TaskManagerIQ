import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import s from "./SchedulePage.module.scss";

export const SchedulePage = () => {
  return (
    <ContentWrapper>
        <PageTitle titleText={"График дежурст и обновлений"} center={true} />
        <Calendar />
    
    </ContentWrapper>
  );
}
