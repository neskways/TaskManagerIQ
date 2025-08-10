import s from "./Selector.module.scss";

export const Selector = ({
  items,
  value,
  defaultValue = "",
  title,
  onChange,
  disabled,
  labelKey = "priority",
}) => {
  const isControlled = value !== undefined && onChange;

  return (
    <div className={s.wrapper}>
      <h4 className={s.title}>{title}</h4>
      <select
        className={s.select}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">-</option>
        {items.map((item) => (
          <option key={item.number} value={item.number}>
            {item[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
};
