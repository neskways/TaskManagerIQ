import s from "./TicketFormPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { useParams } from "react-router-dom";
import { TaskSidebar } from "../../components/TaskSidebar/TaskSidebar";
import { TaskTitleAndText } from "../../components/TaskTitleAndText/TaskTitleAndText";
import { TaskTextBlock } from "../../components/TaskTextBlock/TaskTextBlock";
import { Input } from "./components/Input";

export const TicketFormPage = () => {
  const { id } = useParams();

  return (
    <div className={s.wrapper}>
      <div className={s.inner}>
        <div className={s.left_side}>
          <PageTitle titleText={`Заявка № ${id}`} center={true} />
          <TaskTitleAndText />

          <TaskTextBlock text={"Hello"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:02"} min={"20 минут"}/>
          <TaskTextBlock text={"Саня все фигня"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:40"} min={"17 минут"}/>
          <TaskTextBlock text={"Hello"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:02"} min={"20 минут"}/>
          <TaskTextBlock text={"Саня все фигня"} sender={"Абдурахманов Т. К."} date={"17.07.2025 11:40"} min={"17 минут"}/>

          <Input type="text"/>
        </div>
        <TaskSidebar />
      </div>
    </div>
  );
};
