import s from "./KnowledgeBase.module.scss";
import { Input } from "../../UI/Input/Input";
import { useTheme } from "../../context/ThemeContext";
import { SearchIcon } from "./components/SearchIcon/SearchIcon";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";

export const KnowledgeBase = () => {

  const { theme } = useTheme();

  return (
    <ContentWrapper>
      <PageTitle titleText={"База знаний"} center={true} />
      <div className={s.input_wrapper}>
        <SearchIcon theme={theme} />
        <Input
          className={s.input}
          placeholder={"Найти FAQ"}
          type={"text"}
          paddingForIcon={true}
        />
      </div>
    </ContentWrapper>
  );
};
