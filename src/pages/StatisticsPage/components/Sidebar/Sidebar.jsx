import s from "./Sidebar.module.scss";

export const Sidebar = () => {
  return (
    <div className={s.block}>
        <div className={s.list}>
          <div className={s.item}>Рабочее время за сегодня</div>
          <div className={s.item}>Отчет по клиентам</div>
          <div className={s.item}>Отчет по закрытым задачам</div>
        </div>
    </div>
  );
};
