import s from "./ClientsIcon.module.scss";

export const ClientsIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`sidebar-icon ${s.svg}`}
    >
      <path
        d="M9.69 10.863a4.5 4.5 0 1 1 4.62 0A7.503 7.503 0 0 1 19.5 18c0 1.509-3.403 2.5-7.5 2.5-4.146 0-7.5-.964-7.5-2.5a7.503 7.503 0 0 1 5.19-7.137zM12 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 9c3.5 0 6.5-.874 6.5-1.5a6.5 6.5 0 1 0-13 0c0 .65 2.955 1.5 6.5 1.5z"
        fill="currentColor"
      />
    </svg>
  );
};
