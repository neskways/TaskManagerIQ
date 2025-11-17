import s from "./Selector.module.scss";

export const Selector = ({
  alignTitle,
  items = [],
  value,
  defaultValue = "",
  title,
  smallFont,
  onChange,
  disabled,
  labelKey = "name",   
  valueKey = "id",     
}) => {
  console.log
  const isControlled = value !== undefined && onChange;

  return (
    <div className={s.wrapper}>
      {title && <h4 className={`${s.title} ${alignTitle === "center" ? s.titleCenter : ""}`}>{title}</h4>}
      <select
        className={`${s.select} ${smallFont ? s.smallFont : ""}`}
        value={isControlled ? value : undefined}
        defaultValue={!isControlled ? defaultValue : undefined}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">-</option>
        {items.map((item, index) => (
          <option
            key={item[valueKey] || `opt-${index}`} 
            value={item[valueKey] ?? ""}
          >
            {item[labelKey] ?? ""}
          </option>
        ))}
      </select>
    </div>
  );
};
