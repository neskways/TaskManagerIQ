import s from "./KnowledgeBase.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { DocumentLink } from "./DocumentLink/DocumentLink";
import { Input } from "../../UI/Input/Input";
import { SearchIcon } from "./SearchIcon/SearchIcon";
import { useTheme } from "../../context/ThemeContext";

export const KnowledgeBase = () => {
  const { theme } = useTheme();
  
const pdfFiles = Object.keys(import.meta.glob('/src/assets/faqs/*.pdf', { eager: true })).map(path => {
  const fileName = path.split('/').pop().replace('.pdf', '');
  const url = new URL(path, import.meta.url).href; // получаем корректный URL
  return { name: fileName, url };
});



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
      <div className={s.documents_list}>
        {pdfFiles.map((file) => (
          <DocumentLink key={file.name} name={file.name} url={file.url} />
        ))}
      </div>
    </ContentWrapper>
  );
};
