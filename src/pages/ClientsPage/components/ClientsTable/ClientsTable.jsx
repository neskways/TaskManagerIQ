import s from "./ClientsTable.module.scss";
import { ClientGridCell } from "../ClientGridCell/ClientGridCell";
import { headersTitle } from "../../../../modules/TitlesForTables";

export const ClientsTable = ({
  clients,
  colWidths,
  handleMouseDown,
  tableRef,
  setSelectedClient,
}) => {
  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

  return (
    <div className={s.gridTableWrapper}>
      <div className={s.gridHeaderRow} style={{ gridTemplateColumns }}>
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
      </div>

      <div
        ref={tableRef}
        className={s.gridBody}
        style={{ gridTemplateColumns }}
      >
        {clients.map((client, index) => (
          <ClientGridCell
            key={index}
            clientData={client}
            setSelectedClient={setSelectedClient}
          />
        ))}
      </div>
    </div>
  );
};
