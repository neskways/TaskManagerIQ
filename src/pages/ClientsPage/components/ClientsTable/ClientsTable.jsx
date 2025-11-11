import s from "./ClientsTable.module.scss";
import { ClientGridCell } from "../ClientGridCell/ClientGridCell";
import { headersTitle } from "../../../../modules/TitlesForTables";
import { useState, useMemo } from "react";

export const ClientsTable = ({
  clients,
  colWidths,
  handleMouseDown,
  tableRef,
  setSelectedClient,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

  const keyMap = ["Name", "Priority", "Activities0Fee", "Activities1Fee", "Col5", "Col6"];

  const sortedClients = useMemo(() => {
    if (!sortConfig.key) return clients;

    return [...clients].sort((a, b) => {
      let valA;
      let valB;

      switch (sortConfig.key) {
        case "Activities0Fee":
          valA = a.Activities[0]?.Fee;
          valB = b.Activities[0]?.Fee;
          break;
        case "Activities1Fee":
          valA = a.Activities[1]?.Fee;
          valB = b.Activities[1]?.Fee;
          break;
        case "Col5":
          valA = 1;
          valB = 1;
          break;
        case "Col6":
          valA = 6;
          valB = 6;
          break;
        default:
          valA = a[sortConfig.key];
          valB = b[sortConfig.key];
      }

      // Пустые значения всегда в конец
      const emptyA = valA === null || valA === undefined || valA === "";
      const emptyB = valB === null || valB === undefined || valB === "";
      if (emptyA && emptyB) return 0;
      if (emptyA) return 1;
      if (emptyB) return -1;

      // Попытка привести к числу
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      const bothNumbers = !isNaN(numA) && !isNaN(numB);

      if (bothNumbers) {
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      // Иначе сортировка по строке
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [clients, sortConfig]);

  const handleHeaderClick = (headerIndex) => {
    const key = keyMap[headerIndex];
    if (!key) return;

    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const getSortArrow = (index) => {
    return sortConfig.key === keyMap[index]
      ? sortConfig.direction === "asc"
        ? "▲"
        : "▼"
      : null;
  };

  return (
    <div className={s.gridTableWrapper}>
      <div className={s.gridHeaderRow} style={{ gridTemplateColumns }}>
        {headersTitle.map((header, i) => (
          <div
            key={i}
            className={s.gridHeader}
            onClick={() => handleHeaderClick(i)}
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <div className={s.headerCell}>
              <span className={s.header_span}>
                {header} <span className={s.sortArrow}>{getSortArrow(i)}</span>
              </span>
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

      <div ref={tableRef} className={s.gridBody} style={{ gridTemplateColumns }}>
        {sortedClients.map((client, index) => (
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
