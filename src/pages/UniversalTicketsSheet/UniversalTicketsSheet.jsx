import s from "./UniversalTicketsSheet.module.scss";
import { getTasksList } from "../../api/get/getTasksList";
import { TasksTable } from "./components/TasksTable/TasksTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { SidebarFilter } from "./components/SidebarFilter/SidebarFilter";
import { useState, useEffect } from "react";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";

export const UniversalTicketsSheet = ({ url, titleText }) => {
  const [showFilter, setShowFilter] = useState(() =>
    getFromLocalStorage("showFilter", false)
  );

  useEffect(() => {
    saveToLocalStorage("showFilter", showFilter);
  }, [showFilter]);

  // Логика получения задач
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getTasksList(); // пока аргументы r нет, оставляем пустым
        console.log("Полученные задачи:", tasks);
      } catch (err) {
        console.error("Ошибка при загрузке задач:", err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className={s.wrapper}>
      <PageTitle titleText={titleText} />
      <div className={s.btn_wrapper}>
        <button
          className={s.filter_btn}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Фильтр
        </button>
      </div>
      <TasksTable showFilter={showFilter} />
      <SidebarFilter showFilter={showFilter} setShowFilter={setShowFilter} />
    </div>
  );
};
