import s from "./ClientSearch.module.scss";
import { useState, useRef, useEffect } from "react";

export const ClientSearch = ({ clients = [], onSelect, text }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const wrapperRef = useRef(null);

  // 🔸 Debounce-фильтрация
  useEffect(() => {
    if (query.length < 2) {
      setFiltered([]);
      setShowList(false);
      return;
    }

    const timer = setTimeout(() => {
      const res = clients
        .filter((c) =>
          c.name.toLowerCase().includes(query.trim().toLowerCase())
        )
        .slice(0, 10);
      setFiltered(res);
      setShowList(res.length > 0);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, clients]);

  const handleSelect = (client) => {
    setQuery(client.name);
    setShowList(false);
    onSelect && onSelect(client);
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

  // Закрытие при клике вне блока
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <p className={s.text}>{text}</p>
      <input
        type="text"
        className={s.input}
        value={query}
        placeholder="Введите клиента"
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {showList && (
        <div className={s.dropdown}>
          {filtered.map((client, i) => (
            <div
              key={client.code}
              className={`${s.item} ${
                i === highlightIndex ? s.highlight : ""
              }`}
              onClick={() => handleSelect(client)}
            >
              {client.name}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className={s.noResults}>Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  );
};
