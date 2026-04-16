import Cookies from "js-cookie";
import { MainPage } from "../pages/MainPage/MainPage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { ErrorPage } from "../pages/ErrorPage/ErrorPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { TicketPage } from "../pages/TicketPage/TicketPage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { ClientsPage } from "../pages/ClientsPage/ClientsPage";
import { ReportsPage } from "../pages/ReportsPage/ReportsPage";
import { MainLayout } from "../components/MainLayout/MainLayout";
import { SchedulePage } from "../pages/SchedulePage/SchedulePage";
import { AllTickets } from "../pages/TicketsSheetPages/AllTickets";
import { getFromLocalStorage } from "../modules/localStorageUtils";
import { OpenTickets } from "../pages/TicketsSheetPages/OpenTickets";
import { ClosedToday } from "../pages/TicketsSheetPages/ClosedToday";
import { TaskRedirect } from "../components/TaskRedirect/TaskRedirect";
import { TicketFormPage } from "../pages/TicketFormPage/TicketFormPage";
import { ParametersPage } from "../pages/ParametersPage/ParametersPage";
import { ClosedTickets } from "../pages/TicketsSheetPages/ClosedTickets";
import { BackToTickets } from "../pages/TicketsSheetPages/BackToTickets";
import { OverdueTickets } from "../pages/TicketsSheetPages/OverdueTickets";
import { CurrenеtTickets } from "../pages/TicketsSheetPages/CurrenеtTickets";
import { CreateTicketPage } from "../pages/CreateTicketPage/CreateTicketPage";
import { FirstLineTickets } from "../pages/TicketsSheetPages/FirstLineTickets";
import { MyAssignedTickets } from "../pages/TicketsSheetPages/MyAssignedTickets";
import { RoleProtectedRoute } from "../components/RoleProtectedRoute/RoleProtectedRoute";

const PrivateRoute = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const NavigateFromLogin = ({ children }) => {
  const token = Cookies.get("token");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) return children;

  const defaultPath = "/tickets/my_assigned";
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
        <Route index element={<Navigate to="/tickets" />} />
        {/* Блок задач */}
        <Route path="/tickets" element={<TicketPage />}>
          <Route index element={<TaskRedirect />} />

          <Route
            path="my_assigned"
            element={<MyAssignedTickets titleText="Назначенные мне" />}
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
            path="current_tickets"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <CurrenеtTickets titleText="Текущие задачи сотрудников" />
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
            path="closed"
            element={
              <RoleProtectedRoute allowManagement>
                <ClosedTickets titleText="Закрытые заявки" />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="first_line_tickets"
            element={
              <RoleProtectedRoute allowManagement allowDuty>
                <FirstLineTickets titleText="Задачи первой линии" />
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
            <RoleProtectedRoute allowAdmin allowDuty allowManagement>
              <CreateTicketPage />
            </RoleProtectedRoute>
          }
        />
        //Страница Главная
        <Route path="/main" element={<MainPage />} />
        //Страница задачи
        <Route path="/ticket/:id" element={<TicketFormPage />} />
        //Страница статистики пользователя по выполненым задачам
        <Route path="/reports" element={<ReportsPage />}></Route>
        //Страница со списком всех клиентов
        <Route path="/clients" element={<ClientsPage />}></Route>
        //Страница профиля
        <Route path="/profile" element={<ProfilePage />}></Route>
        //Страница настроек
        <Route path="/parameters" element={<ParametersPage />}></Route>
        //Страница графиков обновлений и дежурств
        <Route path="/shedules" element={<SchedulePage />}></Route>
      </Route>
    </Routes>
  );
};
