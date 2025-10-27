import s from "./Popup.module.scss";

export const Popup = ({ showPopup, text, type, marginNone }) => {
  
  return (
    <>
      {showPopup && (
        <div className={`${s.popup} ${type === true ? s.true : s.false} ${marginNone === true ? "" : s.popupMargin }`}>
          <p>{text}</p>
        </div>
      )}
    </>
  );
}
