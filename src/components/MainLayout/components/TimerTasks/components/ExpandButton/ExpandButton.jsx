import s from "./ExpandButton.module.scss";

export const ExpandButton = ({ expanded, onToggle }) => {
  return (
    <button className={s.expandIcon} onClick={onToggle}>
      {expanded ? "🗗" : "🗖"}
    </button>
  );
};
