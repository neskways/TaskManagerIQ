import s from "./KnowledgeBase.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { Input } from "../../UI/Input/Input";
import { SearchIcon } from "./components/SearchIcon/SearchIcon";
import { useTheme } from "../../context/ThemeContext";

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
