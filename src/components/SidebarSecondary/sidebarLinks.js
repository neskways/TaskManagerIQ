//Список страниц для SidebarSecondary
export const sidebarSecondaryItems = [
  {
    label: "Назначенные мне",
    to: "/tasks/my_assigned",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Открытые заявки",
    to: "/tasks/open_tickets",
    availability_to_everyone: false,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Текущие задачи",
    to: "/tasks/current_tasks",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Возврат к заявкам",
    to: "/tasks/back_to_tickets",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Просроченные заявки",
    to: "/tasks/overdue_tickets",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Закрытые сегодня",
    to: "/tasks/closed_today",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Закрытые заявки",
    to: "/tasks/closed_tickets",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Все заявки",
    to: "/tasks/all_tickets",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  }
];
