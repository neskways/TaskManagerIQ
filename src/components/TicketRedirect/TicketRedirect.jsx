import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const TicketRedirect = () => {
  const defaultPath = "my_assigned";
  const fullSavedPath = getFromLocalStorage("last_secondary_sidebar_path", `/ticket/${defaultPath}`);

  const match = fullSavedPath.match(/^\/ticket\/(.+)$/);
  const nestedPath = match ? match[1] : defaultPath;

  console.log("Redirecting to:", nestedPath); 
  console.log("Redirecting to:"); 

  return <Navigate to={nestedPath} replace />;
};
