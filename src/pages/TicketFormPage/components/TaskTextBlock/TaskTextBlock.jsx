import s from "./TaskTextBlock.module.scss";
import Cookies from "js-cookie";

export const TaskTextBlock = ({ text, user, userId, date, min }) => {

  const currentUserId = Cookies.get("userCode");
  const commentUserId = userId;

  const isMyMessage = currentUserId !== "" && currentUserId === commentUserId;

  const formatMessageDate = (dateInput) => {
    if (!dateInput) return "";

    // dateInput может быть Date или ISO-строкой или числом
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (!(d instanceof Date) || isNaN(d.getTime())) return "";

    const now = new Date();

    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const sameYear = d.getFullYear() === now.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    if (sameDay) {
      return `${hours}:${minutes}`;
    }

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");

    if (sameYear) {
      return `${day}.${month} ${hours}:${minutes}`;
    }

    const year = d.getFullYear();
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const avatarSrc = commentUserId ? `/images/avatars/${commentUserId}.jpg` : null;

  return (
    <div className={`${s.wrapper} ${isMyMessage ? s.my_message : s.other_message}`}>
      {!isMyMessage && avatarSrc && (
        <div className={s.ava}>
          <img src={avatarSrc} alt="" />
        </div>
      )}

      <div className={s.block}>
        <p className={s.sender}>{ isMyMessage ? "Вы" : user }</p>
        <p className={s.text}>{text}</p>
        <p className={s.date}>{formatMessageDate(date)}</p>
        {min && <p className={s.min}>{min}</p>}
      </div>

      {isMyMessage && avatarSrc && (
        <div className={s.ava}>
          <img src={avatarSrc} alt="" />
        </div>
      )}
    </div>
  );
};
