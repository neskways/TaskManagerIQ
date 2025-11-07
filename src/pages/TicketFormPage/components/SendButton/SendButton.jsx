import s from "./SendButton.module.scss";

export const SendButton = () => {

  const color = "#fff";

  return (
    <button className={s.button}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M27.5 2.5L13.75 16.25"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M27.5 2.5L18.75 27.5L13.75 16.25L2.5 11.25L27.5 2.5Z"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
