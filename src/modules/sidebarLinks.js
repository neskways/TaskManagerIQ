import { ListIcon } from "../UI/ListIcon/ListIcon";
import { StatiscticsIcon } from "../UI/StatiscticsIcon/StatiscticsIcon";
import { ClientsIcon } from "../UI/ClientsIcon/ClientsIcon";
import { TableIcon } from "../UI/TableIcon/TableIcon";
import { BookIcon } from "../UI/BookIcon/BookIcon";

export const sidebarItems = [
  {
    label: "Списки",
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

//Список страниц для SidebarSecondary
export const sidebarSecondaryItems = [
  {
    label: "Назначенные мне заявки",
    to: "/tasks/my_assigned",
    exact: true,
  },
  {
    label: "Текущие задачи",
    to: "/tasks/current_tasks",
    exact: true,
  },
  {
    label: "Заявки 1С",
    to: "/tasks/1с_applications",
    exact: true,
  },
  {
    label: "Открытые заявки",
    to: "/tasks/all_open",
    exact: true,
  },
  {
    label: "Заявки моей организации",
    to: "/tasks/my_organization_tickets",
    exact: true,
  },
  {
    label: "Закрытые   сегодня",
    to: "/tasks/closed_today",
    exact: true,
  },
  {
    label: "Все заявки",
    to: "/tasks/all_tickets",
    exact: true,
  },
  {
    label: "Все закрытые заявки",
    to: "/tasks/all_closed",
    exact: true,
  }
];
