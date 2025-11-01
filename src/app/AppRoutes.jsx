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
          {/* если просто /tasks → перенаправляем на последнее место */}
          <Route index element={<TaskRedirect />} />

          <Route
            path="my_assigned"
            element={
              <UniversalTicketsSheet
                url="my_assigned"
                titleText="Назначенные мне заявки"
              />
            }
          />

          <Route
            path="open_tickets"
            element={
              <RoleProtectedRoute allowDuty allowManagement>
                <UniversalTicketsSheet
                  url="open_tickets"
                  titleText="Открытые заявки"
                />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="overdue_tickets"
            element={
              <RoleProtectedRoute allowManagement>
                <UniversalTicketsSheet
                  url="overdue_tickets"
                  titleText="Просроченные заявки"
                />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="closed_today"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <UniversalTicketsSheet
                  url="closed_today"
                  titleText="Закрытые сегодня"
                />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="closed_tickets"
            element={
              <RoleProtectedRoute allowManagement>
                <UniversalTicketsSheet
                  url="closed_tickets"
                  titleText="Закрытые заявки"
                />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="back_to_tickets"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <UniversalTicketsSheet
                  url="back_to_tickets"
                  titleText="Возврат к заявкам"
                />
              </RoleProtectedRoute>
            }
          />

          <Route
            path="all_tickets"
            element={
              <RoleProtectedRoute allowEveryone allowDuty allowManagement>
                <UniversalTicketsSheet
                  url="all_tickets"
                  titleText="Все заявки"
                />
              </RoleProtectedRoute>
            }
          />
        </Route>
        //Страница задачи
        <Route path="/ticket/:id" element={<TicketFormPage />} />
        //Страница статистики пользователя по выполненым задачам
        <Route path="/statistics" element={<StatisticsPage />}></Route>
        //Страница создания заявки
        <Route path="/create" element={<CreateTicketPage />}></Route>
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
