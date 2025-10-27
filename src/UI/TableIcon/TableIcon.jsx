export const TableIcon = ({ isActive, theme }) => {

  const color = theme === "dark" ? "#fff" : isActive ? "#fff" : "#000";

  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.375 4.5H5.625C4.38236 4.5 3.375 5.50736 3.375 6.75V22.5C3.375 23.7426 4.38236 24.75 5.625 24.75H21.375C22.6176 24.75 23.625 23.7426 23.625 22.5V6.75C23.625 5.50736 22.6176 4.5 21.375 4.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 2.25V6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 2.25V6.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.375 11.25H23.625"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
