import s from './Button.module.scss'

export const Button = ({onClick, color = "non", name, type, smallSise = false}) => {
    
    return (
        <button onClick={onClick} className={`${s.button} ${smallSise ? s.button_small : ""} ${color === "red" ? s.color_red : ""}`} type={type}>{ name }</button>
    )
}