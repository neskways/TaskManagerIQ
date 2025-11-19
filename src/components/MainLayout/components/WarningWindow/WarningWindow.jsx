import s from "./WarningWindow.module.scss";
import Cookies from "js-cookie";

export const WarningWindow = ({ onClose }) => {

  const userCode = Cookies.get("userCode");

  return (
    <div className={s.modalOverlay} onClick={onClose}>
      <div className={s.modalWindow} onClick={(e) => e.stopPropagation()}>
        <div className={s.idleWarning}>У ТЕБЯ УЖЕ <b>10 МИНУТ</b> НЕ ВКЛЮЧЕН ТАЙМЕР ПО ВЫПОЛНЕНИЮ ЗАДАЧИ!!!</div>
        <div className={s.idleWarning}>ВКЛЮЧИ ТАЙМЕР И РАБОТАЙ!!!</div>
        <div className={s.idleWarningText}>ЕСЛИ НЕТ ЗАДАЧИ - ПОДОЙДИ К РУКОВОДИТЕЛЮ ИЛИ ПОПРОСИ ДЕЖУРНОГО КИНУТЬ ТЕБЕ ЧТО-НИБУДЬ</div>
        { userCode === "000000005" &&   <div className={s.idleWarningText}> 卐 ЛЕХА ПРИВЕТ БЛЯТЬ СОСКА КАК ДЕЛА, РАБОТАЙ ЧМОШНИЦА 卐</div>}
        <button className={s.btn} onClick={onClose}>Извините пожалуйста, сейчас запущу</button>
      </div>
    </div>
  );
};
