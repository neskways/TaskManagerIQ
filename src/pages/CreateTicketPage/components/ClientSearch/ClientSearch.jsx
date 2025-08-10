import { useState, useRef } from "react";
import s from "./ClientSearch.module.scss";

export const ClientSearch = ({ clients, onSelect }) => {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const wrapperRef = useRef(null);

  const filtered = query
    ? clients.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (client) => {
    setQuery(client.name);
    setSelectedClient(client);
    setShowList(false);
    onSelect && onSelect(client);
  };

  const handleFocus = () => {
    // Показываем список только если нет выбранного клиента
    if (!selectedClient && query.trim() !== "") {
      setShowList(true);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    // Если начали печатать — сбросить выбранного клиента
    if (selectedClient) setSelectedClient(null);
    // Показать список при изменении текста
    setShowList(val.trim() !== "");
  };

  const handleBlur = (e) => {
    // Если кликнули по выпадающему списку — не закрывать сразу
    if (
      wrapperRef.current &&
      wrapperRef.current.contains(e.relatedTarget)
    ) {
      return;
    }
    setShowList(false);
  };

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <input
        type="text"
        className={s.input}
        value={query}
        placeholder="Введите клиента"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />

      {showList && filtered.length > 0 && (
        <div className={s.dropdown} tabIndex="-1">
          {filtered.map((client) => (
            <div
              key={client.code}
              className={s.item}
              tabIndex="0"
              onClick={() => handleSelect(client)}
            >
              {client.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
