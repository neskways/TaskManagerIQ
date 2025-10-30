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
