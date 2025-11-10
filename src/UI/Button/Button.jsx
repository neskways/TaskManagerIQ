import s from './Button.module.scss'

export const Button = ({onClick, name, type}) => {
    
    return (
        <button onClick={onClick} className={s.button} type={type}>{ name }</button>
    )
}