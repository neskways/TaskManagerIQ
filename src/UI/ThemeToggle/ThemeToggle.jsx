import s from "./ThemeToggle.module.scss";
import { useTheme } from '../../context/ThemeContext'; 

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div class={s.toggle_switch}>
      <label class={s.switch_label}>
        <input type="checkbox" class={s.checkbox} onClick={toggleTheme} checked={theme === 'light'} />
        <span class={s.slider}></span>
      </label>
    </div>
  );
};
