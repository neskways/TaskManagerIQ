import s from "./Selector.module.scss";

export const Selector = ({
  alignTitle,
  items = [],
  value,
  title,
  smallFont,
  onChange,
  disabled,
  emptyLabel = "-", // текст, когда список пуст
  labelKey = "name",
  valueKey = "id",
}) => {
  const isControlled = value !== undefined && onChange;

  return (
    <div className={s.wrapper}>
      {title && (
        <h4
          className={`${s.title} ${
            alignTitle === "center" ? s.titleCenter : ""
          } ${smallFont ? s.smallFont : ""}`}
        >
          {title}
        </h4>
      )}
      <select
        className={`${s.select} ${smallFont ? s.smallFont : ""}`}
        value={isControlled ? value : ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        disabled={disabled}
      >
        {items.length === 0 && <option value="">{emptyLabel}</option>}
        {items.length > 0 &&
          items.map((item, index) => (
            <option key={item[valueKey] ?? index} value={item[valueKey]}>
              {item[labelKey]}
            </option>
          ))}
      </select>
    </div>
  );
};
