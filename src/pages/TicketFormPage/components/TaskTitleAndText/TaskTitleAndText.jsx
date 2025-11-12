import s from "./TaskTitleAndText.module.scss";

export const TaskTitleAndText = ( { title, date, description } ) => {

    return (
        <div>
            <div className={s.task_title_wrapper}>
                <h2 className={s.task_title}> { title } </h2>    
                <p className={s.date_text}> { `Cоздана ${date}` } </p>
            </div>
            <p className={s.task_text}>{ description }</p>
        </div>
    );
};
