import { ListIcon } from "./UI/ListIcon/ListIcon";
import { BookIcon } from "./UI/BookIcon/BookIcon";
import { MainIcon } from "./UI/MainIcon/MainIcon";
import { TableIcon } from "./UI/TableIcon/TableIcon";
import { ClientsIcon } from "./UI/ClientsIcon/ClientsIcon";
import { StatiscticsIcon } from "./UI/StatiscticsIcon/StatiscticsIcon";

export const sidebarItems = [
  {
    label: "Главная",
    path: "/main",
    isActive: (currentPath) => currentPath.startsWith("/main"),
    Icon: MainIcon,
  },
  {
    label: "Задачи",
    path: "/tasks",
    isActive: (currentPath) => currentPath.startsWith("/tasks"),
    Icon: ListIcon,
  },
  {
    label: "Клиенты",
    path: "/clients",
    isActive: (currentPath) => currentPath.startsWith("/clients"),
    Icon: ClientsIcon,
  },
  {
    label: "Статистика",
    path: "/statistics",
    isActive: (currentPath) => currentPath.startsWith("/statistics"),
    Icon: StatiscticsIcon,
  },
  {
    label: "Графики",
    path: "/shedules",
    isActive: (currentPath) => currentPath.startsWith("/shedules"),
    Icon: TableIcon,
  },
  {
    label: "База знаний",
    path: "/knowledge_base",
    isActive: (currentPath) => currentPath.startsWith("/knowledge_base"),
    Icon: BookIcon,
  },
];