import s from "./ClientsPage.module.scss";
import { useState } from "react";
import { useClients } from "./useClients";
import { Popup } from "../../UI/Popup/Popup";
import { useResizableTable } from "./useResizableTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ClientModal } from "./components/ClientModal/ClientModal";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";

const url = "http://192.168.11.99/iqit/hs/iqit/ClientGetList";

export const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const { clients, showPopup } = useClients(url);
  const {
    colWidths,
    tableRef,
    handleMouseDown
  } = useResizableTable();

  return (
    <div className={s.gridTableWrapper}>
      <PageTitle titleText="Список клиентов" />

      <ClientsTable
        clients={clients}
        colWidths={colWidths}
        tableRef={tableRef}
        handleMouseDown={handleMouseDown}
        setSelectedClient={setSelectedClient}
      />

      <ClientModal
        clientData={selectedClient}
        onClose={() => setSelectedClient(null)}
      />

      <Popup showPopup={showPopup} text="Ошибка при загрузке клиентов!" />
    </div>
  );
};
