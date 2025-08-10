import { useState, useEffect } from "react";
import s from "./TimerTasks.module.scss";

export const TimerTasks = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // очистка при размонтировании
  }, []);

  const formattedTime = time.toLocaleTimeString();

  return (  
    <div className={s.timer}>
        {formattedTime}
    </div>

  );
};
