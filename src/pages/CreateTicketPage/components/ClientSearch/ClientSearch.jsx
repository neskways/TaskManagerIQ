import s from "./ClientSearch.module.scss";
import { useState, useRef, useEffect } from "react";

export const ClientSearch = ({ clients, onSelect }) => {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(-1); // индекс подсветки

  const wrapperRef = useRef(null);

  // Фильтруем только если 2+ символа и ограничиваем до 5
  const filtered =
    query.length >= 2
      ? clients
          .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      : [];

  const handleSelect = (client) => {
    setQuery(client.name);
    setSelectedClient(client);
    setShowList(false);
    setHighlightIndex(-1);
    onSelect && onSelect(client);
  };

  const handleFocus = () => {
    if (!selectedClient && query.trim().length >= 2) {
      setShowList(true);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedClient(null);
    setShowList(val.trim().length >= 2);
    setHighlightIndex(-1);
  };

  const handleBlur = (e) => {
    if (wrapperRef.current && wrapperRef.current.contains(e.relatedTarget)) {
      return;
    }
    setShowList(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showList || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[highlightIndex]);
    }
  };

  useEffect(() => {
    // Если список изменился, сбрасываем подсветку
    setHighlightIndex(-1);
  }, [filtered]);

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
        onKeyDown={handleKeyDown}
      />

      {showList && filtered.length > 0 && (
        <div className={s.dropdown} tabIndex="-1">
          {filtered.map((client, index) => (
            <div
              key={client.code}
              className={`${s.item} ${index === highlightIndex ? s.highlight : ""}`}
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
