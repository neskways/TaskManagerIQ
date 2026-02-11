import s from './Button.module.scss'

export const Button = ({onClick, name, type, smallSise = false}) => {
    
    return (
        <button onClick={onClick} className={`${s.button} ${smallSise ? s.button_small : ""}`} type={type}>{ name }</button>
    )
}