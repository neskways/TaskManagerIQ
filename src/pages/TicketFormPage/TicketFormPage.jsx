import s from "./TicketFormPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Link, useParams } from "react-router-dom";
import { TaskSidebar } from "../../components/TaskSidebar/TaskSidebar";
import { TaskTitleAndText } from "../../components/TaskTitleAndText/TaskTitleAndText";
import { TaskTextBlock } from "../../components/TaskTextBlock/TaskTextBlock";
import { Input } from "./components/Input";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { BackIcon } from "../../UI/BackIcon/BackIcon";

export const TicketFormPage = () => {

  const { id } = useParams();
  const lastSecondaryPath = getFromLocalStorage("last_secondary_sidebar_path");

  return (
    <ContentWrapper>
        <Link to={lastSecondaryPath} className={s.btn_back} title="Вернуться назад">
            <BackIcon/>
        </Link>
        <div className={s.left_side}>
          <PageTitle titleText={`Заявка № ${id}`} center={true} />
          <TaskTitleAndText />

          <div className={s.text_place}>
            <TaskTextBlock text={"Hello"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:02"} min={"20 минут"}/>
          <TaskTextBlock text={"Саня все фигня"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:40"} min={"17 минут"}/>
          <TaskTextBlock text={"Саня все фигня"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:40"} min={"17 минут"}/>
          </div>

        </div>
        <div className={s.fixed_block}>
          <MultipleInput type="text" rows={3}/>
        </div>

        {/* <TaskSidebar /> */}
    </ContentWrapper>
  );
};
