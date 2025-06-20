import s from './Button.module.scss'

export const Button = ({name, type}) => {
    
    return (
        <button className={s.button} type={type}>{ name }</button>
    )
}