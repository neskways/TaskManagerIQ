export const ClientsIcon = ({ isActive, theme }) => {

  const color = theme === "dark" ? "#fff" : isActive ? "#fff" : "#000";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
    >
      <path
        d="M23 25V22.3333C23 20.9188 22.5259 19.5623 21.682 18.5621C20.8381 17.5619 19.6935 17 18.5 17H9.5C8.30653 17 7.16193 17.5619 6.31802 18.5621C5.47411 19.5623 5 20.9188 5 22.3333V25"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14 12.8333C16.5774 12.8333 18.6667 10.744 18.6667 8.16667C18.6667 5.58934 16.5774 3.5 14 3.5C11.4227 3.5 9.33337 5.58934 9.33337 8.16667C9.33337 10.744 11.4227 12.8333 14 12.8333Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="5"
        y1="24.25"
        x2="23"
        y2="24.25"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};
