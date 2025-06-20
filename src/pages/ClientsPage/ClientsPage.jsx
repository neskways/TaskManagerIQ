import React, { useState, useRef, useEffect } from "react";
import s from "./ClientsPage.module.scss";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../modules/localStorageUtils";
import { ClientGridCell } from "../../components/ClientGridCell/ClientGridCell";
import { headersTitle } from "../../modules/Arrays";
import { ClientModal } from "../../components/ClientModal/ClientModal"; // добавь импорт
import axios from "axios";

const LOCAL_STORAGE_KEY = "clients_table_col_widths";
const defaultWidths = [40, 12, 14, 14, 14, 6];

export const ClientsPage = () => {
  const [colWidths, setColWidths] = useState(() =>
    getFromLocalStorage(LOCAL_STORAGE_KEY, defaultWidths)
  );

  const [selectedClient, setSelectedClient] = useState(null); // управление модалкой

  const startX = useRef(0);
  const tableRef = useRef(null);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);
  const gridTemplateColumns = colWidths.map((w) => `${w}%`).join(" ");

  useEffect(() => {
    saveToLocalStorage(LOCAL_STORAGE_KEY, colWidths);
  }, [colWidths]);

  const handleMouseDown = (e, index) => {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    resizingColIndex.current = index;
    startWidths.current = [colWidths[index], colWidths[index + 1]];
    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return;

    const dx = e.clientX - startX.current;
    const tableWidth = tableRef.current.offsetWidth;
    const deltaPercent = (dx / tableWidth) * 100;

    let left = startWidths.current[0] + deltaPercent;
    let right = startWidths.current[1] - deltaPercent;

    const minPercent = 5;
    if (left < minPercent || right < minPercent) return;

    const newWidths = [...colWidths];
    newWidths[resizingColIndex.current] = left;
    newWidths[resizingColIndex.current + 1] = right;

    setColWidths(newWidths);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };


 const url = 'http://192.168.11.99/iqit/hs/iqit/ClientGetList';

const [clients, setClients] = useState([]);



useEffect(() => {
 axios.post(url, {}, { responseType: 'text' })
  .then(response => {
    try {
      console.log('Клиенты:', response.data);
      const fixed = response.data.replace(/'/g, '"');
const parsed = JSON.parse(fixed);
      setClients(parsed); // ✅ сохраняем уже массив
    } catch (e) {
      console.error('Ошибка при парсинге JSON:', e);
    }
  })

}, []);



  return (
    <div className={s.gridTableWrapper}>
      <PageTitle titleText="Список клиентов" />

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

      <ClientModal
        clientData={selectedClient}
        onClose={() => setSelectedClient(false)}
      />
    </div>
  );
};
