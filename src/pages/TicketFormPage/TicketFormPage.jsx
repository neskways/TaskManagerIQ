import s from "./TicketFormPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Link, useParams } from "react-router-dom";
import { TaskTitleAndText } from "./components/TaskTitleAndText/TaskTitleAndText";
import { TaskTextBlock } from "./components/TaskTextBlock/TaskTextBlock";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { BackIcon } from "../../UI/BackIcon/BackIcon";
import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import { getTaskInfo } from "../../api/get/getTaskInfo";
import { Loading } from "../../UI/Loading/Loading";

export const TicketFormPage = () => {
  const { id } = useParams();
  const lastSecondaryPath = getFromLocalStorage("last_link_path");
  const { theme } = useTheme();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Форматируем дату в dd.mm.yyyy hh:mm:ss
  const formatDate = (date) => {
    if (!date) return "";
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${d}.${m}.${y} ${h}:${min}:${s}`;
  };

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        // Формируем 9-значный ID с ведущими нулями
        const taskId = String(id).padStart(9, "0");
        const data = await getTaskInfo(taskId);

        if (data) {
          setTask({
            taskId: parseInt(data.taskId, 10),
            client: data.clientid,
            title: data.title,
            description: data.description,
            conf: data.conf,
            userId: data.userId,
            owner: data.owner,
            date: new Date(data.date),
            state: data.state,
            comments: data.comments.map((c) => ({
              user: c.user,
              comment: c.comment,
              date: new Date(c.date),
            })),
          });
        }
      } catch (err) {
        console.error("Ошибка при загрузке заявки:", err);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <ContentWrapper>
        <div className={s.centerWrapper}>
          <Loading />
        </div>
      </ContentWrapper>
    );
  }

  if (!task) {
    return (
      <ContentWrapper>
        <p className={s.error}>Заявка не найдена</p>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <Link to={lastSecondaryPath} className={s.btn_back} title="Вернуться назад">
        <BackIcon theme={theme} />
      </Link>

      <div className={s.left_side}>
        <PageTitle titleText={`Заявка №${task.taskId}`} center={true} />
        <TaskTitleAndText title={task.title} date={formatDate(task.date)} description={task.description} />

        {task.comments.map((c, i) => (
          <TaskTextBlock
            key={i}
            user={c.user}
            text={c.comment}
            date={formatDate(c.date)}
          />
        ))}
      </div>

      <div className={s.fixed_block}>
        <MultipleInput type="text" rows={3} />
      </div>
    </ContentWrapper>
  );
};
