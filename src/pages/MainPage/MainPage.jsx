import s from "./MainPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { ContactsTable } from "./Components/ContactsTable/ContactsTable";

export const MainPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText="Главная" center />
      <div className={s.inner}>
        <div className=""></div>
        <ContactsTable />
      </div>
    </ContentWrapper>
  );
};
