import s from "./SchedulePage.module.scss";
import Cookies from "js-cookie";
import { useTheme } from "../../context/ThemeContext";
import { Calendar } from "./components/Calendar/Calendar";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const SchedulePage = () => {
  const settings = getFromLocalStorage("secret_settings", {});
  const role = Cookies.get("role");
  const userCode = Cookies.get("userCode");

  const { theme } = useTheme();

  const titleMem =
    (userCode === "000000007" || userCode === "000000054") ||
    String(import.meta.env.VITE_TOKEN_MANAGER) !== role
      ? settings.censorship
        ? "График дежурств"
        : "Позорища"
      : "График дежурств";

  return (
    <ContentWrapper reletive={true}>
      <PageTitle titleText={titleMem} center={true} />

      <div className={s.contentWrapper}>
        <div className={s.absoluteContent}>
          <Calendar theme={theme} />
        </div>
      </div>
    </ContentWrapper>
  );
};