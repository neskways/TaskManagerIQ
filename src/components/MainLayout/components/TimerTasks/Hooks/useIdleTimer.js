import { useEffect, useRef } from "react";

export const useIdleTimer = (onIdle, idleTimeout = 300000, activeTaskId, idleModal) => {
  const idleRef = useRef(null);

  const resetIdle = () => {
    clearTimeout(idleRef.current);
    if (idleModal || activeTaskId) return;
    idleRef.current = setTimeout(onIdle, idleTimeout);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetIdle));
    resetIdle();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      clearTimeout(idleRef.current);
    };
  }, [activeTaskId, idleModal]);
};
