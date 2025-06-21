import s from "./ClientsTable.module.scss";
import { headersTitle } from "../../modules/Arrays";
import { ClientGridCell } from "../ClientGridCell/ClientGridCell";

export const ClientsTable = ({
  clients,
  colWidths,
  handleMouseDown,
  tableRef,
  setSelectedClient
}) => {
  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

  return (
    <div
      ref={tableRef}
      className={s.gridTable}
      style={{ gridTemplateColumns }}
    >
      {headersTitle.map((header, i) => (
        <div key={i} className={s.gridHeader}>
          <div className={s.headerCell}>
            <span className={s.header_span}>{header}</span>
            {i < headersTitle.length - 1 && (
              <div
                className={s.resizer}
                onMouseDown={(e) => handleMouseDown(e, i)}
              />
            )}
          </div>
        </div>
      ))}

      {clients.map((client, index) => (
        <ClientGridCell
          key={index}
          clientData={client}
          setSelectedClient={setSelectedClient}
        />
      ))}
    </div>
  );
};
