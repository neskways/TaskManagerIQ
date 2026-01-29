import s from "./SecretSettingsBlock.module.scss";
import { useEffect, useState } from "react";
import { Checkbox } from "../../../../UI/Checkbox/Checkbox";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../../../modules/localStorageUtils";

const SECRET_SETTINGS_KEY = "secret_settings";

export const SecretSettingsBlock = () => {
  const [settings, setSettings] = useState({
    screamer_soft: false,
    screamer_hard: false,
    secret_links_edges: false,
    secret_links_images: false,
    meme_sounds: false,
    censorship: false,
    snow_effect: false, // новая настройка снега
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Загружаем сохранённые настройки при монтировании
  useEffect(() => {
    const saved = getFromLocalStorage(SECRET_SETTINGS_KEY, {});
    setSettings((prev) => ({ ...prev, ...saved }));
  }, []);

  // Обработчик изменения чекбоксов
  const handleChange = (key) => (e) => {
    const newValue = e.target.checked;
    const updated = { ...settings, [key]: newValue };
    
    setSettings(updated);
    saveToLocalStorage(SECRET_SETTINGS_KEY, updated);
    setHasChanges(true); 
  };

  return (
    <div className={s.wrapper}>
      {hasChanges && <p className={s.notice}>Перезагрузите страницу, чтобы применить настройки. </p>}
      <div className={s.list}>
        <div className={s.item}>
          <Checkbox
            checked={settings.screamer_soft}
            onChange={handleChange("screamer_soft")}
          />
          <p>Скримеры раз в 2 минуты</p>
        </div>

        <div className={s.item}>
          <Checkbox
            checked={settings.screamer_hard}
            onChange={handleChange("screamer_hard")}
          />
          <p>Скримеры раз в 10 минут по жёстче</p>
        </div>

        <div className={s.item}>
          <Checkbox
            checked={settings.secret_links_edges}
            onChange={handleChange("secret_links_edges")}
          />
          <p>Тайные ссылки по углам</p>
        </div>

        <div className={s.item}>
          <Checkbox
            checked={settings.secret_links_images}
            onChange={handleChange("secret_links_images")}
          />
          <p>Тайные ссылки на картинках</p>
        </div>

        <div className={s.item}>
          <Checkbox
            checked={settings.meme_sounds}
            onChange={handleChange("meme_sounds")}
          />
          <p>Мемные звуки</p>
        </div>

        <div className={s.item}>
          <Checkbox
            checked={settings.censorship}
            onChange={handleChange("censorship")}
          />
          <p>Цензура слов</p>
        </div>
      </div>
    </div>
  );
};
