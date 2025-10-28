import s from "./ClientSearch.module.scss";
import { useState, useRef, useEffect } from "react";

export const ClientSearch = ({ clients = [], onSelect, text }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [showList, setShowList] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeCode, setActiveCode] = useState(null);

  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Нормализованная функция-утилита для доступа к имени/коду (подстраховка)
  const getName = (c) => (c?.name ?? c?.Name ?? "").toString();
  const getCode = (c) => (c?.code ?? c?.Code ?? "").toString();

  // Поиск (debounce) — выполняется только когда нет выбранного клиента
  useEffect(() => {
    if (selectedClient || query.trim().length < 2) {
      setFiltered([]);
      setShowList(false);
      setHighlightIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      const res = (clients || [])
        .filter((c) => getName(c).toLowerCase().includes(q))
        .slice(0, 10);

      setFiltered(res);
      setShowList(res.length > 0);
      setHighlightIndex(res.length > 0 ? 0 : -1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, clients, selectedClient]);

  // Синхронизируем activeCode при изменении highlightIndex
  useEffect(() => {
    if (highlightIndex >= 0 && filtered[highlightIndex]) {
      setActiveCode(getCode(filtered[highlightIndex]));
    } else {
      // не очищаем активный код, если есть выбранный клиент — оставляем
      if (!selectedClient) setActiveCode(null);
    }
  }, [highlightIndex, filtered, selectedClient]);

  // Выбор клиента (click / enter)
  const selectClient = (client) => {
    setQuery(getName(client));
    setSelectedClient(client);
    setActiveCode(getCode(client));
    setShowList(false);
    setHighlightIndex(-1);
    onSelect && onSelect(client);
  };

  // Обработка клавиш
  const handleKeyDown = (e) => {
    // если список закрыт, но есть результаты — ArrowDown должен открыть его
    if (!showList && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (filtered.length > 0) {
        e.preventDefault();
        setShowList(true);
        setHighlightIndex(0);
      }
      return;
    }

    if (!showList) return;

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
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && filtered[highlightIndex]) {
        e.preventDefault();
        selectClient(filtered[highlightIndex]);
      }
    } else if (e.key === "Escape") {
      setShowList(false);
      setHighlightIndex(-1);
    }
  };

  // Фокус — показываем список если есть результаты и клиент не выбран
  const handleFocus = () => {
    if (!selectedClient && filtered.length > 0) {
      setShowList(true);
      // если нет подсветки — ставим 0
      setHighlightIndex((prev) => (prev >= 0 ? prev : 0));
    }
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    // если меняется текст и был выбран клиент — сбрасываем выбор
    if (selectedClient && val !== getName(selectedClient)) {
      setSelectedClient(null);
      setActiveCode(null);
      onSelect && onSelect(null);
    }
  };

  // Закрытие при клике вне блока
  useEffect(() => {
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowList(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Скроллим подсвеченный элемент в видимую область (если нужно)
  useEffect(() => {
    if (!showList) return;
    const el = wrapperRef.current?.querySelectorAll(`.${s.item}`)[highlightIndex];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, showList]);

  return (
    <div className={s.wrapper} ref={wrapperRef}>
      <p className={s.text}>{text}</p>

      <input
        ref={inputRef}
        type="text"
        className={s.input}
        value={query}
        placeholder="Введите клиента"
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {showList && filtered.length > 0 && (
        <div className={s.dropdown}>
          {filtered.map((client, i) => {
            const code = getCode(client);
            const isHighlighted = i === highlightIndex;
            const isActive = code === activeCode && !showList === false; // activeCode применяется when selected or navigated
            return (
              <div
                key={code || i}
                className={[
                  s.item,
                  isHighlighted ? s.highlight : "",
                  code === activeCode ? s.active_client : "",
                ].join(" ").trim()}
                onMouseEnter={() => setHighlightIndex(i)}
                onMouseDown={(ev) => {
                  // onMouseDown чтобы предотвратить blur перед click
                  ev.preventDefault();
                }}
                onClick={() => selectClient(client)}
              >
                {getName(client)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
