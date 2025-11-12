import s from "./ProfilePage.module.scss";
import Cookies from "js-cookie";
import { Loading } from "../../UI/Loading/Loading";
import { useState, useEffect, useRef } from "react"; 
import { usePopup } from "../../context/PopupContext";
import { useTheme } from "../../context/ThemeContext";
import { taskStatuses } from "../../modules/TaskStatuses";
import { getTasksList } from "../../api/get/getTasksList";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ProfileBlock } from "./Components/ProfileBlock/ProfileBlock";
import { getFromLocalStorage } from "../../modules/localStorageUtils";
import { ProfileTasksTable } from "./Components/ProfileTasksTable/ProfileTasksTable";

const secToHHMMSS = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s
  ).padStart(2, "0")}`;
};

const memeSounds = [
  "/sounds/hornet_edino.mp3",
  "/sounds/hollow-knight-hornet-voice-2-3.mp3",
  "/sounds/hollow-knight-hornet-voice-11.mp3",
  "/sounds/hornet_gitgud.mp3",
];


export const ProfilePage = () => {
  const [visible, setVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showPopup } = usePopup();
  const username = Cookies.get("username");
  const userCode = Cookies.get("userCode");
  const role = Cookies.get("role");
  const { theme } = useTheme();

  const darkLogo = "/images/logo/logo_dark.png";
  const lightLogo = "/images/logo/logo.png";

  const [memeSoundsEnabled, setMemeSoundsEnabled] = useState(false);

  useEffect(() => {
    const settings = getFromLocalStorage("secret_settings", {});
    setMemeSoundsEnabled(settings.meme_sounds);
  }, []);

  const handleAvatarClick = () => {
  if (!memeSoundsEnabled) return; // если выключено — не играем звук

  const randomSound = memeSounds[Math.floor(Math.random() * memeSounds.length)];
  const audio = new Audio(randomSound);
  audio.volume = 0.4;
  audio.play().catch((err) => console.error("Audio play error:", err));
};

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
          timeSpent: secToHHMMSS(item.timeSpent),
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
    <>
      <div className={s.wrapper}>
        <div className={`${s.inner} ${visible ? s.show : ""}`}>
          <PageTitle titleText={"Профиль"} center={true} />

          <div className={s.profile_wrapper}>
            <div className={s.img_block}>
              <img
                className={s.img}
                src={`/images/avatars/${userCode}.jpg`}
                alt={username}
                onDoubleClick={handleAvatarClick}
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
              <div className={s.loading_wrap}>
                <Loading />
              </div>
            ) : tasks.length === 0 ? (
              <p>Нет текущих задач</p>
            ) : (
              <ProfileTasksTable tasks={tasks} theme={theme} />
            )}
          </div>
        </div>

        <img
          className={s.logo_opacity}
          src={theme === "light" ? lightLogo : darkLogo}
          onDoubleClick={() =>
            window.open("https://vk.com/furryevent", "_blank")
          }
          alt=""
        />
      </div>

      {(userCode === "000000002" || userCode === "000000005") && (
        <ProfileBlock className={s.profile_block_absolute} />
      )}
    </>
  );
};
