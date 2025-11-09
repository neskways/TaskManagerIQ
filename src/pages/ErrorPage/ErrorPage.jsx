import { Link } from "react-router-dom";
import s from "./ErrorPage.module.scss";

export const ErrorPage = () => {
  return (
    <div className={s.wrapper}>
      <div class={s.error_container}>
        <h1 className={s.title}> 404 </h1>
        <p className={s.text}>Такой страницы не существует! Уходите отсюда пожалуйста!</p>
        <Link className={s.link} to="/main">На главную</Link>
      </div>
    </div>
  );
};
