import s from "./CloseIcon.module.scss";

export const CloseIcon = () => {
  return (
    <svg className={`sidebar-icon ${s.svg}`} xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
      <g id="Menu / Close_MD">
        <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
};
