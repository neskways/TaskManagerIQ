export const StatiscticsIcon = ({ isActive, theme }) => {
  
  const color = theme === "dark" ? "#fff" : isActive ? "#fff" : "#000";

  return (
    <svg
      width="27"
      height="29"
      viewBox="0 0 27 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M25.875 7.25L15.1875 18.7292L9.5625 12.6875L1.125 21.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.125 7.25H25.875V14.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
