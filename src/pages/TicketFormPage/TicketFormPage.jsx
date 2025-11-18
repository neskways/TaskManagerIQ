import s from "./TicketFormPage.module.scss";
import Cookies from "js-cookie";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Loading } from "../../UI/Loading/Loading";
import { useTheme } from "../../context/ThemeContext";
import { usePopup } from "../../context/PopupContext";
import { BackIcon } from "../../UI/BackIcon/BackIcon";
import { getTaskInfo } from "../../api/get/getTaskInfo";
import { CloseIcon } from "../../UI/CloseIcon/CloseIcon";
import { createComment } from "../../api/create/createComment";
import { SendButton } from "./components/SendButton/SendButton";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { MultipleInput } from "../../UI/MultipleInput/MultipleInput";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { TaskTextBlock } from "./components/TaskTextBlock/TaskTextBlock";
import { TicketSidebar } from "./components/TicketSidebar/TicketSidebar";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
import { TaskTitleAndText } from "./components/TaskTitleAndText/TaskTitleAndText";

export const TicketFormPage = ({ modal = false, taskId, onClose }) => {

  const routeId = useParams().id;
  const realId = modal ? taskId : routeId;

  const lastSecondaryPath = getFromLocalStorage("last_link_path");
  const { theme } = useTheme();
  const { showPopup } = usePopup();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const didFetch = useRef(false);

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

  const fetchTask = async () => {
    setLoading(true);

    try {
      const formattedId = String(realId).padStart(9, "0");
      const data = await getTaskInfo(formattedId);

      if (!data) {
        return;
      }

      setTask({
        taskId: parseInt(data.taskId, 10),
        client: data.client,
        title: data.title,
        description: data.description,
        conf: data.conf,
        userId: data.userId,
        owner: data.owner,
        date: new Date(data.date),
        state: data.state,
        timeSpent: data.timeSpent,
        returnId: data.return || null,
        returnName: data.returnName,
        contacts: data.contacts,
        comments: data.comments.map((c) => ({
          user: c.user,
          userId: c.userid,
          comment: c.comment,
          date: new Date(c.date),
        })),
      });
    } catch (err) {
      if (err?.response?.status !== 401) {
        showPopup("Не удалось загрузить заявку.", { type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    fetchTask();
  }, [realId]);

  const handleSendComment = async () => {
    if (!commentText.trim()) {
      showPopup("Комментарий не может быть пустым", { type: "warning" });
      return;
    }

    try {
      const formattedTaskId = String(task.taskId).padStart(9, "0");

      await createComment({
        taskid: formattedTaskId,
        comment: commentText.trim(),
      });

      const currentUserId = String(Cookies.get("userCode") ?? "");
      const currentUserName = String(Cookies.get("userName") ?? "Вы");

      const newComment = {
        user: currentUserName,
        userId: currentUserId,
        comment: commentText.trim(),
        date: new Date(),
      };

      setTask((prev) => ({
        ...prev,
        comments: [...prev.comments, newComment],
      }));

      setCommentText("");
      showPopup("Комментарий добавлен", { type: "success" });
    } catch (err) {
      showPopup("Не удалось добавить комментарий", { type: "error" });
    }
  };

  if (loading) {
    return (
      <div className={s.inner_box}>
        <div className={s.centerWrapper}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={s.inner_box}>
        <p className={s.error}>Заявка не найдена</p>
        {modal && (
          <button className={s.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={s.inner_box}>
      {!modal && (
        <Link
          to={lastSecondaryPath}
          className={s.btn_back}
          title="Вернуться назад"
        >
          <BackIcon theme={theme} />
        </Link>
      )}

      {modal && (
        <button className={s.closeBtn} onClick={onClose}>
          <CloseIcon />
        </button>
      )}

      <div className={s.wrapper}>
        <div className={s.left_side}>
          <div className={s.left_content}>
            <div className={s.task_wrapper}>
              <PageTitle titleText={`Заявка №${task.taskId}`} center />
              <TaskTitleAndText
                title={task.title}
                date={formatDate(task.date)}
                description={task.description}
              />
            </div>

            <div className={s.comment_wrap}>
              {task.comments.map((c, i) => (
                <TaskTextBlock
                  key={i}
                  user={c.user}
                  userId={c.userId}
                  text={c.comment}
                  date={c.date}
                />
              ))}
            </div>
          </div>

          <div className={s.com_input}>
            <MultipleInput
              rows={4}
              placeholder="Введите комментарий..."
              setUserData={setCommentText}
              value={commentText}
            />
            <SendButton onClick={handleSendComment} />
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <TicketSidebar
          taskId={task.taskId}
          currentClient={task.client}
          currentStatus={task.state}
          currentExecutor={task.owner}
          contacts={task.contacts}
          returnId={task.returnId}
          returnName={task.returnName}
          timeSpent={task.timeSpent}
        />
      </div>
    </div>
  );
};
