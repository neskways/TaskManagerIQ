//Заголовки таблицы клиентов
export const headersTitle = ["Клиент", "Приоритет", "Абонентка 1С", "Абонентка СА", "Почасовка", "Задачи"];

//Заголовки таблицы задач
export const headersTitleTickets = ["Заголовок", "Клиент", "Отдел", "Состояние", "Приоритет", "Время", "Создал", "Создано в"];

//Отделы
export const departmentsItems = [
    { number: 1, priority: "1С" },
    { number: 2, priority: "СА" }
];

//Приоритеты задач
export const prioritiesItems = [
    { number: 1, priority: "Низкий" },
    { number: 2, priority: "Средний" },
    { number: 3, priority: "Высокий" },
    { number: 4, priority: "Критический" }
];

//Состояние задач
export const stateTaskItems = [
    { number: 1, priority: "Открыто" },
    { number: 2, priority: "В работе" },
    { number: 3, priority: "Закрыто" },
];

// Массив клиентов
export const clientsItems = [
  { code: "CL001", name: "ООО «Альфа»" },
  { code: "CL002", name: "ЗАО «Бета-Сервис»" },
  { code: "CL003", name: "ИП Сидоров С.С." },
  { code: "CL004", name: "ООО «Гамма-Строй»" },
  { code: "CL005", name: "АО «Дельта»" },
  { code: "CL005", name: "КАРАстылев" },
];

export const executorsItems = [
  { number: 1, code: "EX001", fio: "Иванов Иван Иванович", department: 1 },
  { number: 2, code: "EX002", fio: "Петров Пётр Петрович", department: 1 },
  { number: 3, code: "EX003", fio: "Сидоров Сергей Сергеевич", department: 2 },
  { number: 4, code: "EX004", fio: "Кузнецов Николай Николаевич", department: 2 }
];
