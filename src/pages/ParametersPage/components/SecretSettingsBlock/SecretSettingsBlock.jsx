import s from "./SecretSettingsBlock.module.scss";
import { Checkbox } from "../../../../UI/Checkbox/Checkbox";

export const SecretSettingsBlock = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.list}>
        <div className={s.item}>
          <Checkbox />
          <p>Скримеры раз в 30 минут</p>
        </div>
         <div className={s.item}>
          <Checkbox />
          <p>Скримеры раз в 30 минут по жёстче</p>
        </div>
        <div className={s.item}>
          <Checkbox />
          <p>Тайные ссылки по углам</p>
        </div>
        <div className={s.item}>
          <Checkbox />
          <p>Тайные ссылки на картинках</p>
        </div>
        <div className={s.item}>
          <Checkbox />
          <p>Мемные звуки</p>
        </div>
      </div>
      <div className={s.img_block}>
        <img src="/images/memes/spotti.png" alt="" />
      </div>
    </div>
  );
};
