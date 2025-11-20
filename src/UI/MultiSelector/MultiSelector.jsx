import { useState, useRef, useEffect } from "react";
import s from "./MultiSelector.module.scss";

export const MultiSelector = ({ title, items, value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggleItem = (name) => {
    if (value.includes(name)) {
      onChange(value.filter((v) => v !== name));
    } else {
      onChange([...value, name]);
    }
  };

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const getTitle = () => {
    if (value.length === 0) return title;
    const found = items.filter((i) => value.includes(i.name));
    return found.map((f) => f.name).join(", ");
  };

  return (
    <div className={s.selectorWrapper} ref={ref}>
      {title && <h4 className={`${s.title}`}>{title}</h4>}
      <div
        className={`${s.selectorHeader} ${open ? s.open : ""}`}
        onClick={() => setOpen(!open)}
      >
        <span className={value.length ? s.selectedText : ""}>{getTitle()}</span>
        <div className={s.arrow} />
      </div>

      {open && (
        <div className={s.dropdown}>
          {items.map((item) => (
            <div
              key={item.name}
              className={`${s.option} ${value.includes(item.name) ? s.active : ""}`}
              onClick={() => toggleItem(item.name)}
            >
              <input
                type="checkbox"
                checked={value.includes(item.name)}
                readOnly
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
