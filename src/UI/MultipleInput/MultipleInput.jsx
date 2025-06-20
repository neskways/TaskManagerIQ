import s from './MultipleInput.module.scss'

export const MultipleInput = ({value, text, isErrorIn, type, setUserData }) => {
    
    return (
        <div className={s.input_box}>
            <p className={`${s.text}`}> {text} </p>
            <textarea className={`${s.input} ${isErrorIn ? s.input_error : ''}`} rows={5} />
        </div>
    )
}