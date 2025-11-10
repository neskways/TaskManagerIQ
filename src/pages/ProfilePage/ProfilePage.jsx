import { useState, useEffect } from "react";
import s from "./ProfilePage.module.scss";
import Cookies from "js-cookie";
import { useTheme } from "../../context/ThemeContext";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ProfileBlock } from "./Components/ProfileBlock/ProfileBlock";
import { getTasksList } from "../../api/get/getTasksList";
import { taskStatuses } from "../../modules/TaskStatuses";
import { usePopup } from "../../context/PopupContext";
import { Loading } from "../../UI/Loading/Loading";

export const ProfilePage = () => {
  const [visible, setVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();
  const username = Cookies.get("username");
  const userCode = Cookies.get("userCode");
  const role = Cookies.get("role");
  const { theme } = useTheme();

  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await getTasksList(
          [
            taskStatuses.PAUSED.code,
            taskStatuses.IN_PROGRESS.code,
            taskStatuses.TRANSFERRED.code,
          ],
          userCode
        );

        const mapped = data.map((item) => ({
          number: parseInt(item.number, 10),
          title: item.title,
          client: item.client,
          status: item.status,
          executor: item.executor,
          timeSpent: item.timeSpent,
        }));

        setTasks(mapped);
      } catch (err) {
        console.error("Ошибка при загрузке задач:", err);
        showPopup("Не удалось загрузить текущие задачи", { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userCode, showPopup]);

  return (
    <div className={s.wrapper}>
      <div className={`${s.inner} ${visible ? s.show : ""}`}>
        <PageTitle titleText={"Профиль"} center={true} />

        <div className={s.profile_wrapper}>
          <div className={s.img_block}>
            <img
              className={s.img}
              src={`/images/avatars/${userCode}.jpg`}
              alt={username}
            />
          </div>
          <div className={s.text_block}>
            <h3 className={s.username}>{username}</h3>
            <p className={s.role}>{role}</p>
            <a
              className={s.iqcompany}
              href="https://iqprog.ru/"
              target="_blank"
              rel="noreferrer"
            >
              АйКю Компани
            </a>
          </div>
        </div>

        <h4 className={s.second_title}>Текущие задачи</h4>

        <div className={s.tasks_table_wrapper}>
          {loading ? (
            <Loading />
          ) : tasks.length === 0 ? (
            <p>Нет текущих задач</p>
          ) : (
            <div className={s.tasks_table}>
              <div className={s.table_header}>
                <div>Номер</div>
                <div>Название</div>
                <div>Клиент</div>
                <div>Статус</div>
                <div>Исполнитель</div>
                <div>Время</div>
              </div>
              <div className={s.table_body}>
                {tasks.map((task) => (
                  <div key={task.number} className={s.table_row}>
                    <div>{task.number}</div>
                    <div>{task.title}</div>
                    <div>{task.client}</div>
                    <div>{task.status}</div>
                    <div>{task.executor}</div>
                    <div>{task.timeSpent}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      { userCode === "000000002" && <ProfileBlock className={s.profile_block_absolute} /> }

      <img
        className={s.logo_opacity}
        src={theme === "light" ? lightLogo : darkLogo}
        onDoubleClick={() =>
          window.open("https://vk.com/furryevent", "_blank")
        }
        alt=""
      />
    </div>
  );
};
