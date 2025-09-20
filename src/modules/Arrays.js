//Заголовки таблицы клиентов
export const headersTitle = ["Клиент", "Приоритет", "Абонентка 1С", "Абонентка СА", "Почасовка", "Задачи"];

//Заголовки таблицы задач
export const headersTitleTickets = ["Заголовок", "Клиент", "Отдел", "Состояние", "Приоритет", "Время", "Создал", "Создано в"];

//Отделы
export const departmentsItems = [
    { number: 1, priority: "1С:Бухгалтерия" },
    { number: 2, priority: "1С:Розница" }
];

export const executorsItems = [
  { number: 1, code: "EX001", fio: "Иванов Иван Иванович", department: 1 },
  { number: 2, code: "EX002", fio: "Петров Пётр Петрович", department: 1 },
  { number: 3, code: "EX003", fio: "Сидоров Сергей Сергеевич", department: 2 },
  { number: 4, code: "EX004", fio: "Кузнецов Николай Николаевич", department: 2 }
];

export const updateSchedule = {
  month: 'Сентябрь 2025',
  daysInMonth: 30,
  clients: [
    {
      name: 'Лигапак',
      updates: {
        1: 'Т',
        3: 'И',
        7: 'С',
        15: 'Д',
      },
    },
    {
      name: 'ДРСУ',
      updates: {
        2: 'И',
        4: 'С',
        6: 'Т',
        12: 'Т',
        30: 'Д',
      },
    },
    {
      name: 'Хатажукаевский хлеб',
      updates: {
        5: 'С',
        10: 'И',
        20: 'Т',
      },
      
    },
    {
      name: 'Фабмай',
      updates: {
        1: 'С',
        3: 'И',
        30: 'Т',
      },
      
    },
  ],
};
