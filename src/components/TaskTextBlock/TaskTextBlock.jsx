import s from "./TaskTextBlock.module.scss";

export const TaskTextBlock = ( { text, sender, date, min } ) => {
  return (
    <div className={s.wrapper}>
        <div className={s.block}>
            <p className={s.sender}> { sender } </p>
            <p className={s.text}> { text } </p>
            <p className={s.date}> {date} </p>
            <p className={s.min}> {min} </p>
        </div>
        <div className={s.ava}>
            
        </div>
    </div>
  );
};
