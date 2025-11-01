import s from "./ProfileBlock.module.scss";
import Cookies from "js-cookie";

export const ProfileBlock = () => {

    const handleSetRole = (role) => {
        Cookies.set("role", role, { expires: Number(import.meta.env.VITE_TOKEN_LIFETIME) }); 
      };
    

  return (
    <div className={s.tixo}>
      <button
        className={s.btn}
        onClick={() => handleSetRole(String(import.meta.env.VITE_TOKEN_EMPLOYEE))}
      >
        Сотрудник
      </button>
      <button
        className={s.btn}
        onClick={() => handleSetRole(String(import.meta.env.VITE_TOKEN_DUTY))}
      >
        Дежурный
      </button>
      <button
        className={s.btn}
        onClick={() => handleSetRole(String(import.meta.env.VITE_TOKEN_MANAGER))}
      >
        Руководитель
      </button>
    </div>
  );
};
