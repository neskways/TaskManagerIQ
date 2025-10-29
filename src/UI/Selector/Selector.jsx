import s from "./Selector.module.scss";

export const Selector = ({
  items = [],
  value,
  defaultValue = "",
  title,
  onChange,
  disabled,
  labelKey = "name",   // 🟢 теперь по умолчанию "name"
  valueKey = "id",     // 🟢 добавили valueKey
}) => {
  const isControlled = value !== undefined && onChange;

  return (
    <div className={s.wrapper}>
      {title && <h4 className={s.title}>{title}</h4>}
      <select
        className={s.select}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">-</option>
        {items.map((item, index) => (
          <option
            key={item[valueKey] || `opt-${index}`} // ✅ гарантируем уникальный ключ
            value={item[valueKey] ?? ""}
          >
            {item[labelKey] ?? ""}
          </option>
        ))}
      </select>
    </div>
  );
};
