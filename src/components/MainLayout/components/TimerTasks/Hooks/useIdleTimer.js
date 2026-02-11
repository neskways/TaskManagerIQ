import { useEffect, useRef } from "react";

export const useIdleTimer = (onIdle, delay, activeTaskId) => {
  const timerRef = useRef(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    const isActive = Boolean(activeTaskId);

    // если задача только что остановилась
    if (!isActive && wasActiveRef.current) {
      timerRef.current = setTimeout(() => {
        onIdle();
      }, delay);
    }

    // если задача стала активной — сбрасываем таймер
    if (isActive && timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    wasActiveRef.current = isActive;

    return () => {};
  }, [activeTaskId, delay, onIdle]);
};
