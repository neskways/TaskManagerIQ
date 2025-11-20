import { useState, useRef, useEffect } from "react";
import s from "./MultiSelector.module.scss";

export const MultiSelector = ({
  title,
  items,
  value = [],
  onChange,
  keyField = "id",
  labelField = "name",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleItem = (item) => {
    const val = item[keyField];
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const getTitle = () => {
    if (!value.length) return title;
    return items
      .filter((i) => value.includes(i[keyField]))
      .map((i) => i[labelField])
      .join(", ");
  };

  return (
    <div className={s.selectorWrapper} ref={ref}>
      {title && <h4 className={s.title}>{title}</h4>}
      <div className={`${s.selectorHeader} ${open ? s.open : ""}`} onClick={() => setOpen(!open)}>
        <span className={value.length ? s.selectedText : ""}>{getTitle()}</span>
        <div className={s.arrow} />
      </div>

      {open && (
        <div className={s.dropdown}>
          {items.map((item) => {
            const label = item[labelField];
            return (
              <div
                key={item[keyField]}
                className={`${s.option} ${value.includes(item[keyField]) ? s.active : ""}`}
                onClick={() => toggleItem(item)}
              >
                <input type="checkbox" checked={value.includes(item[keyField])} readOnly />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
