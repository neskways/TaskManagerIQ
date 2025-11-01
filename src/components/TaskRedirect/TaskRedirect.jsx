import { Navigate } from "react-router-dom";
import { getFromLocalStorage } from "../../modules/localStorageUtils";

export const TaskRedirect = () => {
  const defaultPath = "my_assigned";
  const fullSavedPath = getFromLocalStorage(
    "last_link_path",
    `/ticket/${defaultPath}`
  );

  const match = fullSavedPath.match(/^\/ticket\/(.+)$/);
  const nestedPath = match ? match[1] : defaultPath;

  return <Navigate to={nestedPath} replace />;

  return <Navigate to={nestedPath} replace />;
};
