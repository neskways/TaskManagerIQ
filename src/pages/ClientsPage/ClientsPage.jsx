import s from "./ClientsPage.module.scss";
import { useState, useEffect } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";
import { ClientModal } from "./components/ClientModal/ClientModal";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { useResizableTable } from "./useResizableTable";
import { usePopup } from "../../context/PopupContext";
import { getClients } from "../../api/get/getClients";
import { ReloadIcon } from "../../UI/ReloadIcon/ReloadIcon";
import { Loading } from "../../UI/Loading/Loading";
import { useTheme } from "../../context/ThemeContext";

const CACHE_KEY = "clientsCache";

export const ClientsPage = () => {
  const { theme } = useTheme();
  const { showPopup } = usePopup();
  const { colWidths, tableRef, handleMouseDown } = useResizableTable();

  const cachedClients = getFromLocalStorage(CACHE_KEY, null);
  const [clients, setClients] = useState(cachedClients || []);
  const [selectedClient, setSelectedClient] = useState(null);
  const [initialLoading, setInitialLoading] = useState(!cachedClients);
  const [spinning, setSpinning] = useState(false);

  const loadClients = async (force = false) => {
    if (!force && cachedClients) return;

    setInitialLoading(true);
    try {
      const data = await getClients();
      setClients(data);
      saveToLocalStorage(CACHE_KEY, data);

      showPopup("Данные успешно обновлены!", { type: "success" });
    } catch (err) {
      console.error("Ошибка при загрузке клиентов:", err);

      if (err.response?.status !== 401) {
        showPopup("Ошибка при загрузке клиентов!", { type: "error" });
      }
    } finally {
      setInitialLoading(false);
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (!cachedClients) loadClients();
  }, []);

  const handleRefresh = async () => {
    if (spinning) return;
    setSpinning(true);
    await loadClients(true);
  };

  return (
    <ContentWrapper>
      <div className={s.header}>
        <PageTitle titleText="Список клиентов" center />
        <button className={s.refreshBtn} onClick={handleRefresh}>
          <ReloadIcon theme={theme} spinning={spinning} />
        </button>
      </div>

      {initialLoading ? (
        <div className={s.centerWrapper}>
          <Loading className={s.loading} />
        </div>
      ) : (
        <ClientsTable
          clients={clients}
          colWidths={colWidths}
          tableRef={tableRef}
          handleMouseDown={handleMouseDown}
          setSelectedClient={setSelectedClient}
        />
      )}

      <ClientModal
        clientData={selectedClient}
        onClose={() => setSelectedClient(null)}
      />
    </ContentWrapper>
  );
};
