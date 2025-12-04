import s from "./ThemeToggle.module.scss";
import { useTheme } from '../../context/ThemeContext'; 

export const ThemeToggle = () => {
  
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={s.toggle_switch}>
      <label className={s.switch_label}>
        <input 
          type="checkbox" 
          className={s.checkbox} 
          onChange={toggleTheme} 
          checked={theme === 'light'} 
        />
        <span className={s.slider}></span>
      </label>
    </div>
  );
};
