import { useEffect } from "react";
import { AppRoutes } from "./app/AppRoutes";
import { useNavigate } from "react-router-dom";
import { registerAuthHandlers } from "./api/axios";
import { usePopup } from "./context/PopupContext";
import { logoutUserWithoutToken } from "./modules/logoutUser";

export function App() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  useEffect(() => {
    registerAuthHandlers({
      logout: logoutUserWithoutToken,
      navigate,
      popup: showPopup,
    });
  }, []);


  return <AppRoutes />;
}
