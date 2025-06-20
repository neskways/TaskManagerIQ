import s from "./Popup.module.scss";

export const Popup = ({ showPopup, text, type }) => {
  
  return (
    <>
      {showPopup && (
        <div className={s.popup}>
          <p>{text}</p>
        </div>
      )}
    </>
  );
}
