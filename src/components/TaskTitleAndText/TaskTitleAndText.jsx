import s from "./TaskTitleAndText.module.scss";
import { useState } from "react";

export const TaskTitleAndText = () => {
    const [title, setTitle] = useState("Общий заголовок заглушка Общий заголовок заглушка Общий заголовок заглушка Общий заголовок заглушка Общий заголовок заглушка");

    const handleChange = (e) => {
        e.target.style.height = 'auto'; // сброс высоты
        e.target.style.height = e.target.scrollHeight + 'px'; // установка по содержимому
        setTitle(e.target.value); // обновление состояния
    };

    return (
        <div>
            <div className={s.task_title_wrapper}>
                <textarea
                    className={s.task_title}
                    value={title} rows={1}
                    onChange={handleChange}
                    spellCheck={false}
                    placeholder="Заголовок задачи"
                />    
                <p className={s.date_text}> { "создана 27.06.2025 14:88:00" } </p>
            </div>
            <p className={s.date_text}> { "Описание задачи" } </p>
            <p className={s.task_text}>+</p>
        </div>
    );
};
