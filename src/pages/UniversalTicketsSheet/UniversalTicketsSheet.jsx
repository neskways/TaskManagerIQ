import s from "./UniversalTicketsSheet.module.scss";
import { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { TicketFormPage } from "../TicketFormPage/TicketFormPage";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { TasksTable } from "./components/TasksTable/TasksTable";

export const UniversalTicketsSheet = ({ titleText, queryParams }) => {
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  const location = useLocation();
  const navigate = useNavigate();

  const [openedTaskId, setOpenedTaskId] = useState(null);

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  // Слушаем параметр open в URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const open = params.get("open");
    setOpenedTaskId(open);
  }, [location]);

  // Открытие задачи → меняем URL
  const openTaskViaUrl = (id) => {
    const params = new URLSearchParams(location.search);
    params.set("open", id);
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  // Закрытие модалки → убираем open
  const closeModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete("open");
    navigate(`${location.pathname}?${params.toString()}`, { replace: false });
  };

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />

      <TasksTable queryParams={queryParams} onOpenTask={openTaskViaUrl} />

      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />

      {openedTaskId && (
        <div className={s.modalOverlay} onClick={closeModal}>
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <TicketFormPage modal taskId={openedTaskId} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
};
