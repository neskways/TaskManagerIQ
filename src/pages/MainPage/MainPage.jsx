import s from "./MainPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { ContactsTable } from "./Components/ContactsTable/ContactsTable";

export const MainPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText="Главная" center />
      <div className={s.inner}>
         <p></p>
        <div className={s.video}>

          <video
            src="/video/mem.mp4"
            autoPlay
            preload="metadata"
            style={{
              width: "380px",
              maxWidth: "380px",
              borderRadius: "12px",
            }}
          >
            Ваш браузер не поддерживает видео.
          </video>
        </div>
        <ContactsTable />
      </div>
    </ContentWrapper>
  );
};
