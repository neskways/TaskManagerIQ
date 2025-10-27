import s from './Input.module.scss'

export const Input = ({value, text, isErrorIn, type, setUserData, placeholder }) => {
    
    return (
        <div className={s.input_box}>
            <p className={`${s.text}`}> {text} </p>
            <input placeholder={placeholder} value={value} type={type} className={`${s.input} ${isErrorIn ? s.input_error : ''}`}  onChange={(e) => setUserData(e.target.value)} required maxLength={80}/>
        </div>
    )
}