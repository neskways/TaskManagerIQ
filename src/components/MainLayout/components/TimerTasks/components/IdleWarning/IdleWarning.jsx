import { WarningWindow } from "../../../../components/WarningWindow/WarningWindow";
import Cookies from "js-cookie";

export const IdleWarning = ({ onClose }) => {
  const role = Cookies.get("role");
  const managerRole = String(import.meta.env.VITE_TOKEN_MANAGER);

  const isManager = role === managerRole;

  return (
    <>
      {!isManager && <WarningWindow onClose={onClose} />}
    </>
  );
};
