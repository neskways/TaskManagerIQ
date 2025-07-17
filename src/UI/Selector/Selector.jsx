import s from "./Selector.module.scss";

export const Selector = ({ items, defaultValue, title }) => {
  return (
    <div className={s.wrapper}>
      <h4 className={s.title}>{ title }</h4>
      <select className={s.select} required="" defaultValue={defaultValue}>
      {items.map((item) => (
        <option key={item.number} value={item.number}>
          {item.priority}
        </option>
      ))}
    </select>
    </div>
  );
};
