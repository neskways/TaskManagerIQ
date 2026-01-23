import s from "./ClientsPage.module.scss";
import Cookies from "js-cookie";
import { useState, useEffect, useCallback, useMemo } from "react";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";
import { ClientModal } from "./components/ClientModal/ClientModal";
import { ContentWrapper } from "../../components/ContentWrapper/ContentWrapper";
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
import { MESSAGES } from "../../modules/messages";

const CACHE_KEY = "clientsCache";

export const ClientsPage = () => {
  const { theme } = useTheme();
  const { showPopup } = usePopup();
  const role     = Cookies.get("role");
  const userCode = Cookies.get("userCode");
  const { colWidths, tableRef, handleMouseDown } = useResizableTable();

  const settings = getFromLocalStorage("secret_settings", {});
  const titleMem = (userCode === "000000007" || userCode === "000000054") || String(import.meta.env.VITE_TOKEN_MANAGER) != role ? settings.censorship ? "Список клиентов" : "Список пидарасов" : "Список клиентов";
  
  const cachedClients = useMemo(() => getFromLocalStorage(CACHE_KEY, null), []);
  const [clients, setClients] = useState(cachedClients || []);
  const [selectedClient, setSelectedClient] = useState(null);
  const [initialLoading, setInitialLoading] = useState(!cachedClients);
  const [spinning, setSpinning] = useState(false);

  const sortClients = (arr) =>
    [...arr].sort((a, b) => (a.Name || "").localeCompare(b.Name || ""));

  const loadClients = useCallback(
    async (force = false) => {
      if (!force && cachedClients) return;

      setInitialLoading(true);

      try {
        const data = await getClients();

        const sorted = sortClients(data);

        setClients(sorted);
        saveToLocalStorage(CACHE_KEY, sorted);

        if (force) {
          showPopup(MESSAGES.dataUpdate, { type: "info" });
        }
      } catch (err) {
        console.error("Ошибка при загрузке клиентов:", err);
        if (err.response?.status !== 401) {
          showPopup("Ошибка при загрузке клиентов!", { type: "error" });
        }
      } finally {
        setInitialLoading(false);
        setSpinning(false);
      }
    },
    [cachedClients, showPopup]
  );

  useEffect(() => {
    if (!cachedClients) loadClients();
  }, [cachedClients, loadClients]);

  const handleRefresh = useCallback(async () => {
    if (!spinning) {
      setSpinning(true);
      await loadClients(true);
    }
  }, [spinning, loadClients]);

  return (
    <ContentWrapper>
      <div className={s.header}>
        <PageTitle titleText={titleMem} center />
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
