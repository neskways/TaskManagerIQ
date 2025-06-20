import { ListIcon } from "../UI/ListIcon/ListIcon";
import { StatiscticsIcon } from "../UI/StatiscticsIcon/StatiscticsIcon";
import { ClientsIcon } from "../UI/ClientsIcon/ClientsIcon";
import { TableIcon } from "../UI/TableIcon/TableIcon";
import { BookIcon } from "../UI/BookIcon/BookIcon";

export const sidebarItems = [
  {
    label: "Списки",
    path: "/ticket/my_assigned",
    isActive: (currentPath) => currentPath.startsWith("/ticket"),
    Icon: ListIcon,
  },
  {
    label: "Статистика",
    path: "/statistics",
    isActive: (currentPath) => currentPath.startsWith("/statistics"),
    Icon: StatiscticsIcon,
  },
  {
    label: "Клиенты",
    path: "/clients",
    isActive: (currentPath) => currentPath.startsWith("/clients"),
    Icon: ClientsIcon,
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

//Список страниц для SidebarSecondary
export const sidebarSecondaryItems = [
  {
    label: "Назначенные мне заявки",
    to: "/ticket/my_assigned",
    exact: true,
  },
  {
    label: "Текущие задачи",
    to: "/ticket/current_tasks",
    exact: true,
  },
  {
    label: "Заявки 1С",
    to: "/ticket/1с_applications",
    exact: true,
  },
  {
    label: "Открытые заявки",
    to: "/ticket/all_open",
    exact: true,
  },
  {
    label: "Заявки моей организации",
    to: "/ticket/my_organization_tickets",
    exact: true,
  },
  {
    label: "Закрытые   сегодня",
    to: "/ticket/closed_today",
    exact: true,
  },
  {
    label: "Все заявки",
    to: "/ticket/all_tickets",
    exact: true,
  },
  {
    label: "Все закрытые заявки",
    to: "/ticket/all_closed",
    exact: true,
  },
];
