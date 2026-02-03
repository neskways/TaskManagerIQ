import { createContext, useContext, useState } from "react";

const ActiveTaskContext = createContext(null);

export const ActiveTaskProvider = ({ children }) => {
  const [activeTask, setActiveTask] = useState(null);

  const startTask = (task) => {
    if (!task?.id) return;
    setActiveTask({ id: task.id, title: task.title });
  };

  const clearActiveTask = () => setActiveTask(null);

  return (
    <ActiveTaskContext.Provider
      value={{
        activeTask,
        startTask,
        clearActiveTask,
      }}
    >
      {children}
    </ActiveTaskContext.Provider>
  );
};

export const useActiveTask = () => {
  const context = useContext(ActiveTaskContext);
  if (!context) throw new Error("useActiveTask must be used inside ActiveTaskProvider");
  return context;
};
