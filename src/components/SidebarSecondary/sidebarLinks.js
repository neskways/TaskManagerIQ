//Список страниц для SidebarSecondary
export const sidebarSecondaryItems = [
  {
    label: "Назначенные мне",
    to: "/tickets/my_assigned",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Открытые заявки",
    to: "/tickets/open_tickets",
    availability_to_everyone: false,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Текущие заявки",
    to: "/tickets/current_tickets",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Первая линия",
    to: "/tickets/first_line_tickets",
    availability_to_everyone: false,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Возврат к заявкам",
    to: "/tickets/back_to_tickets",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Просроченные заявки",
    to: "/tickets/overdue_tickets",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Закрытые сегодня",
    to: "/tickets/closed_today",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  },
  {
    label: "Закрытые заявки",
    to: "/tickets/closed",
    availability_to_everyone: false,
    availability_to_dute: false,
    availability_to_management: true,
  },
  {
    label: "Все заявки",
    to: "/tickets/all_tickets",
    availability_to_everyone: true,
    availability_to_dute: true,
    availability_to_management: true,
  }
];
