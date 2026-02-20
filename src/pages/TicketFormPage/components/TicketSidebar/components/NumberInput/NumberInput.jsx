import { useState, useEffect } from "react";
import s from "./NumberInput.module.scss";

export const NumberInput = ({ value = 0, onChange }) => {
  const [inputValue, setInputValue] = useState(String(value ?? ""));

  useEffect(() => {
    setInputValue(String(value ?? ""));
  }, [value]);

  const handleChange = (e) => {
    // разрешаем только цифры
    const onlyNumbers = e.target.value.replace(/[^\d]/g, "");

    setInputValue(onlyNumbers);

  };

  return (
    <div className={s.input_box}>
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        placeholder="0"
        className={s.input}
      />
    </div>
  );
};