import s from "./ClientsPage.module.scss";
import { useState } from "react";
import { useClients } from "./useClients";
import { Popup } from "../../UI/Popup/Popup";
import { useResizableTable } from "./useResizableTable";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { ClientModal } from "./components/ClientModal/ClientModal";
import { ClientsTable } from "./components/ClientsTable/ClientsTable";
import { getClients } from "../../api/getClients";
import { ContentWrapper } from "../../UI/ContentWrapper/ContentWrapper";

export const ClientsPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);
  const { clients, showPopup } = getClients();
  const { colWidths, tableRef, handleMouseDown } = useResizableTable();

  return (
    <ContentWrapper>
      <PageTitle titleText="Список клиентов" center={true} />

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
    </ContentWrapper>
  );
};
