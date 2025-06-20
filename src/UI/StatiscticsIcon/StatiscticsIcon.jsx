import s from "./StatiscticsIcon.module.scss";

export const StatiscticsIcon = () => {
  return (
    <svg
      className={`sidebar-icon ${s.svg}`}
      xmlns="http://www.w3.org/2000/svg"
      height="21"
      viewBox="0 0 21 21"
      width="21"
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(4 3)"
      >
        <path d="m.5.5v11c0 1.1045695.8954305 2 2 2h11" />
        <path d="m2.5 9.5 3-3 2 2 5-5" />
        <path d="m12.5 6.5v-3h-3" />
      </g>
    </svg>
  );
};
