import s from "./Screamer.module.scss";

export const Screamer = ({ type = "light" }) => {
  const imgSrc =
    type === "hard"
      ? "/images/memes/kavabanka.jpg" 
      : "/images/memes/kavabankLight.jpg"; 

  return (
    <div className={s.block}>
      <img src={imgSrc} alt="screamer" />
    </div>
  );
};
