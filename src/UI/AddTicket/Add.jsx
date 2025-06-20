import s from "./AddTicket.module.scss";

export const AddTicket = () => {

  return (
   <span className={s.wrapper}>
     <svg
      className={s.svg}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <g clipPath="url(#clip0_1_55)">
        <rect y="13" width="30" height="4" fill="#23C040" />
        <rect
          x="13"
          y="30"
          width="30"
          height="4"
          transform="rotate(-90 13 30)"
          fill="#23C040"
        />
      </g>
      <defs>
        <clipPath id="clip0_1_55">
          <rect width="30" height="30" fill="white" />
        </clipPath>
      </defs>
    </svg>
   </span>
  );
};
