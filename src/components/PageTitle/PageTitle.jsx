import s from "./PageTitle.module.scss";

export const PageTitle = ({ titleText, center }) => {

    return (
       <h2 className={`${s.title} ${center ? s.center : ''}`}>{titleText}</h2>
    )
}
