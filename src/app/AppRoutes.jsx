import Cookies from 'js-cookie';
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

  const defaultPath = "/ticket/my_assigned";
  const saved = getFromLocalStorage("last_secondary_sidebar_path", defaultPath);

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
        //Перенаправляет на странице /ticket по умолчанию
        <Route index element={<Navigate to="/tasks" replace />} />
        //Страница с задачами, по умолчанию показывает список задач пользователя
        <Route path="/tasks" element={<TicketPage />}>
          <Route index element={<TaskRedirect />} />
          <Route
            path="my_assigned"
            element={
              <UniversalTicketsSheet
                url={"my_assigned"}
                titleText={"Назначенные мне заявки"}
              />
            }
          />
          <Route
            path="1с_applications"
            element={
              <UniversalTicketsSheet
                url={"1с_applications"}
                titleText={"Заявки 1С"}
              />
            }
          />
          <Route
            path="all_open"
            element={
              <UniversalTicketsSheet
                url={"all_open"}
                titleText={"Все открытые заявки"}
              />
            }
          />
          <Route
            path="all_closed"
            element={
              <UniversalTicketsSheet
                url={"all_closed"}
                titleText={"Все закрытые заявки"}
              />
            }
          />
          <Route
            path="my_organization_tickets"
            element={
              <UniversalTicketsSheet
                url={"my_organization_tickets"}
                titleText={"Заявки моей организации"}
              />
            }
          />
          <Route
            path="all_tickets"
            element={
              <UniversalTicketsSheet
                url={"all_tickets"}
                titleText={"Все заявки"}
              />
            }
          />
          <Route
            path="closed_today"
            element={
              <UniversalTicketsSheet
                url={"closed_today"}
                titleText={"Закрытые сегодня"}
              />
            }
          />
          <Route
            path="current_tasks"
            element={
              <UniversalTicketsSheet
                url={"current_tasks"}
                titleText={"Текущие задачи"}
              />
            }
          />
          <Route
            path="all_open"
            element={
              <UniversalTicketsSheet
                url={"all_open"}
                titleText={"Все открытые заявки"}
              />
            }
          />
        </Route>
        //Страница задачи
        <Route path="/ticket_form/:id" element={<TicketFormPage />} />
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
