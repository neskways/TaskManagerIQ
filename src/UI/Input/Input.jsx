import s from './Input.module.scss'

export const Input = ({value, text, isErrorIn, type, onBlur, setUserData, placeholder, paddingForIcon, patternTel, maxLen = 1000 }) => {
    
    return (
        <div className={s.input_box}>
            <p className={`${s.text}`}> {text} </p>
            <input pattern={patternTel} maxLength={maxLen} onBlur={onBlur} placeholder={placeholder} value={value} type={type} className={`${s.input} ${isErrorIn ? s.input_error : ''} ${paddingForIcon ? s.padding : ""}`}  onChange={(e) => setUserData(e.target.value)}/>
        </div>
    )
}