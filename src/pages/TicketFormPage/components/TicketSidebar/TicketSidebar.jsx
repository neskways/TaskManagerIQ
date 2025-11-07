// TicketSidebar.jsx
import s from "./TicketSidebar.module.scss";
import { Selector } from "../../../../UI/Selector/Selector";
import { TaskStatuses } from "../../../../modules/taskStates";
import { Button } from "../../../../UI/Button/Button";

export const TicketSidebar = () => {
  // Преобразуем объект в массив для селектора
  const statusItems = Object.entries(TaskStatuses).map(([key, { code, title }]) => ({
    id: code,
    name: title,
  }));

  return (
    <div className={s.wrapper}>
      <Selector
        title="Статус задачи"
        alignTitle="center"
        items={statusItems}
        labelKey="name"     // Что отображать
        valueKey="id"       // Что будет значением
        defaultValue=""
        onChange={(value) => console.log("Выбран статус:", value)}
      />

      <Button name={"Сохранить"} />
    </div>
  );
};
