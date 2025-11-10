import Cookies from "js-cookie";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { TicketPage } from "../pages/TicketPage/TicketPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { ClientsPage } from "../pages/ClientsPage/ClientsPage";
import { MainLayout } from "../components/MainLayout/MainLayout";
import { SchedulePage } from "../pages/SchedulePage/SchedulePage";
import { getFromLocalStorage } from "../modules/localStorageUtils";
import { KnowledgeBase } from "../pages/KnowledgeBase/KnowledgeBase";
import { TaskRedirect } from "../components/TaskRedirect/TaskRedirect";
import { TicketFormPage } from "../pages/TicketFormPage/TicketFormPage";
import { StatisticsPage } from "../pages/StatisticsPage/StatisticsPage";
import { ParametersPage } from "../pages/ParametersPage/ParametersPage";
import { CreateTicketPage } from "../pages/CreateTicketPage/CreateTicketPage";
import { RoleProtectedRoute } from "../components/RoleProtectedRoute/RoleProtectedRoute";
import { UniversalTicketsSheet } from "../pages/UniversalTicketsSheet/UniversalTicketsSheet";
import { MainPage } from "../pages/MainPage/MainPage";
import { MyAssignedTasks } from "../pages/TicketsSheetPages/MyAssignedTasks";
import { CurrentTasks } from "../pages/TicketsSheetPages/CurrentTasks";
import { AllTickets } from "../pages/TicketsSheetPages/AllTickets";
import { BackToTickets } from "../pages/TicketsSheetPages/BackToTickets";
import { ClosedToday } from "../pages/TicketsSheetPages/ClosedToday";
import { OpenTickets } from "../pages/TicketsSheetPages/OpenTickets";
import { OverdueTickets } from "../pages/TicketsSheetPages/OverdueTickets";
import { ClosedTickets } from "../pages/TicketsSheetPages/ClosedTickets";
import { FirstLineTask } from "../pages/TicketsSheetPages/FirstLineTask";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const NavigateFromLogin = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) return children;

  const defaultPath = "/tasks/my_assigned";
  const saved = getFromLocalStorage("last_tasks_path", defaultPath);

  return <Navigate to={saved} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <NavigateFromLogin>
            <LoginPage />
          </NavigateFromLogin>
        }
      />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route
          path="*"
          element={
            <PrivateRoute>
              <ErrorPage />
            </PrivateRoute>
          }
        />
        {/* Главный редирект со слеша */}
        <Route index element={<Navigate to="/tasks" />} />
        {/* Блок задач */}
        <Route path="/tasks" element={<TicketPage />}>
          <Route index element={<TaskRedirect />} />

          <Route
            path="my_assigned"
            element={<MyAssignedTasks titleText="Назначенные мне" />}
          />

          <Route
            path="open_tickets"
            element={
              <RoleProtectedRoute allowDuty allowManagement>
                <OpenTickets titleText="Открытые заявки" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="current_tasks"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <CurrentTasks titleText="Текущие задачи сотрудников" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="overdue_tickets"
            element={
              <RoleProtectedRoute allowManagement>
                <OverdueTickets titleText="Просроченные заявки" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="closed_today"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <ClosedToday titleText="Закрытые сегодня" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="closed_tickets"
            element={
              <RoleProtectedRoute allowManagement>
                <ClosedTickets titleText="Закрытые заявки" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="first_line_task"
            element={
              <RoleProtectedRoute allowManagement allowDuty>
                <FirstLineTask titleText="Задачи первой линии" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="back_to_tickets"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <BackToTickets titleText="Возврат к заявкам" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="all_tickets"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <AllTickets titleText="Все заявки" />
              </RoleProtectedRoute>
            }
          />
        </Route>
        //Страница создания заявки // Страница создания заявки
        <Route
          path="/create"
          element={
            <RoleProtectedRoute allowDuty allowManagement>
              <CreateTicketPage />
            </RoleProtectedRoute>
          }
        />
        //Страница Главная
        <Route path="/main" element={<MainPage />} />
        //Страница задачи
        <Route path="/ticket/:id" element={<TicketFormPage />} />
        //Страница статистики пользователя по выполненым задачам
        <Route path="/statistics" element={<StatisticsPage />}></Route>
        //Страница со списком всех клиентов
        <Route path="/clients" element={<ClientsPage />}></Route>
        //Страница профиля
        <Route path="/profile" element={<ProfilePage />}></Route>
        //Страница настроек
        <Route path="/parameters" element={<ParametersPage />}></Route>
        //Страница графиков обновлений и дежурств
        <Route path="/shedules" element={<SchedulePage />}></Route>
        //Страница база знаний
        <Route path="/knowledge_base" element={<KnowledgeBase />}></Route>
      </Route>
    </Routes>
  );
};
