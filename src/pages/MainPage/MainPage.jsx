import s from "./MainPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const MainPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText="Главная" center />

      <div className={s.videoWrapper}>
        <video
          src="/videos/cats.mp4"
          controls
          preload="metadata"
          style={{ maxWidth: "100%", borderRadius: "8px" }}
        >
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </div>
    </ContentWrapper>
  );
};
