import s from "./StatisticsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const StatisticsPage = () => {
  return (
    <ContentWrapper>
      <PageTitle titleText={"Статистика"} center={true} />

      <div className={s.videoWrapper}>
        <video
          src="/videos/prettycat.mp4"
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
