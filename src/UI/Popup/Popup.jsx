import s from "./Popup.module.scss";

export const Popup = ({ showPopup, text, type }) => {
  
  return (
    <>
      {showPopup && (
        <div className={`${s.popup} ${type === true ? s.true : s.false}`}>
          <p>{text}</p>
        </div>
      )}
    </>
  );
}
