import s from "./Checkbox.module.scss";

export const Checkbox = ({ checked = false, onChange, disabled = false }) => {
  return (
    <div className={s.checkbox_container}>
      <label
        className={`${s.ios_checkbox} ${s.red} ${
          disabled ? s.disabled : ""
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={s.checkbox_wrapper}>
          <div className={s.checkbox_bg}></div>
          <svg
            className={s.checkbox_icon}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              className={s.check_path}
              d="M4 12L10 18L20 6"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </label>
    </div>
  );
};
