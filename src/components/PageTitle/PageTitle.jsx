import s from "./PageTitle.module.scss";

export const PageTitle = ({ titleText }) => {

    return (
       <h2 className={s.title}>{titleText}</h2>
    )
}
