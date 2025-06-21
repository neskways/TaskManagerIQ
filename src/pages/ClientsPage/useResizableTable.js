import { useRef, useState, useEffect } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "../../modules/localStorageUtils";

const LOCAL_STORAGE_KEY = "clients_table_col_widths";
const defaultWidths = [40, 12, 14, 14, 14, 6];

export const useResizableTable = () => {
  const [colWidths, setColWidths] = useState(() =>
    getFromLocalStorage(LOCAL_STORAGE_KEY, defaultWidths)
  );
  const tableRef = useRef(null);
  const startX = useRef(0);
  const isResizing = useRef(false);
  const startWidths = useRef([0, 0]);
  const resizingColIndex = useRef(null);

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

  return {
    colWidths,
    setColWidths,
    tableRef,
    handleMouseDown
  };
};
