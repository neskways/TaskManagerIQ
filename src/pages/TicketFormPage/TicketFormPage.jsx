import s from "./TicketFormPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Link, useParams } from "react-router-dom";
import { TaskTitleAndText } from "../../components/TaskTitleAndText/TaskTitleAndText";
import { TaskTextBlock } from "../../components/TaskTextBlock/TaskTextBlock";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { BackIcon } from "../../UI/BackIcon/BackIcon";
import { useTheme } from "../../context/ThemeContext";

export const TicketFormPage = () => {

  const { id } = useParams();
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");
  const { theme } = useTheme();

  return (
    <ContentWrapper>
        <Link to={lastSecondaryPath} className={s.btn_back} title="Вернуться назад">
            <BackIcon theme={theme}/>
        </Link>
        <div className={s.left_side}>
          <PageTitle titleText={`Заявка № ${id}`} center={true} />
          <TaskTitleAndText />
        </div>
        <div className={s.fixed_block}>
          <MultipleInput type="text" rows={3}/>
        </div>

        {/* <TaskSidebar /> */}
    </ContentWrapper>
  );
};
