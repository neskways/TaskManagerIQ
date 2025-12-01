export const BookIcon = ({ isActive, theme }) => {
  
  const color = theme === "dark" ? "#fff" : isActive ? "#fff" : "#000";

  return (
    <svg
      width="28"
      height="27"
      viewBox="0 0 28 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.66663 21.9375C4.66663 21.1916 4.97392 20.4762 5.5209 19.9488C6.06788 19.4213 6.80974 19.125 7.58329 19.125H23.3333"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.58329 2.25H23.3333V24.75H7.58329C6.80974 24.75 6.06788 24.4537 5.5209 23.9262C4.97392 23.3988 4.66663 22.6834 4.66663 21.9375V5.0625C4.66663 4.31658 4.97392 3.60121 5.5209 3.07376C6.06788 2.54632 6.80974 2.25 7.58329 2.25Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
