import { useRef, useEffect } from 'react';
import s from './Input.module.scss';

export const Input = ({ type }) => {
    const textareaRef = useRef(null);

    const handleInput = () => {
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto'; // сбросить высоту
            el.style.height = `${el.scrollHeight}px`; // задать нужную
        }
    };

    useEffect(() => {
        handleInput(); // при монтировании, если есть дефолтный текст
    }, []);

    return (
        <div className={s.input_box}>
            <textarea
                ref={textareaRef}
                className={s.input}
                placeholder="Введите заметку"
                type={type}
                spellCheck={false}
                required
                maxLength={1000}
                onInput={handleInput}
            />
        </div>
    );
};
