import s from "./BackIcon.module.scss";

export const BackIcon = ({ theme }) => {

  const color = theme === "dark" ? "#fff" : "#000";
  console.log(color)
  return (
    <svg
      className={s.svg}
      fill={color}
      width="40px"
      height="40px"
      viewBox="0 0 512 512"
      data-name="Layer 1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M34,256,210,80l21.21,21.2L91.4,241H478v30H91.4L231.25,410.84,210,432Z" />
    </svg>
  );
};
