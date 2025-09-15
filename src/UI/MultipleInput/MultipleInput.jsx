import s from './MultipleInput.module.scss'

export const MultipleInput = ({ text, isErrorIn, rows, placeholder }) => {
    
    return (
        <div className={s.input_box}>
            <p className={`${s.text}`}> {text} </p>
            <textarea className={`${s.input} ${isErrorIn ? s.input_error : ''}`} rows={rows} placeholder={placeholder}/>
        </div>
    )
}