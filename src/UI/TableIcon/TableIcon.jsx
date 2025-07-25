import s from "./TableIcon.module.scss";

export const TableIcon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`sidebar-icon ${s.svg}`}
    >
      <path
        d="M9.5 16v2.5h5V16h-5zm0-1h5v-3h-5v3zM20 16h-4.5v2.5h4a.5.5 0 0 0 .5-.5v-2zm0-1v-3h-4.5v3H20zM4 16v2a.5.5 0 0 0 .5.5h4V16H4zm0-1h4.5v-3H4v3zm10.5-7h-5v3h5V8zm1 0v3H20V8h-4.5zm-7 0H4v3h4.5V8zm-4-4.5h15A1.5 1.5 0 0 1 21 5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V5a1.5 1.5 0 0 1 1.5-1.5z"
        fill="currentColor"
      />
    </svg>
  );
};
