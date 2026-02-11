import { useState, useEffect, useRef } from "react";
import { getTaskQueue } from "../../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../../modules/taskStatuses";

const REFRESH_INTERVAL_MS = 17000;

export const useTasks = (showPopup, playAudio) => {
  const [tasks, setTasks] = useState([]);
  const [secondsMap, setSecondsMap] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const prevTaskIdsRef = useRef(new Set());
  const pollingRef = useRef(null);

  const loadTasks = async () => {
    try {
      const states = [
        taskStatuses.PAUSED.code,
        taskStatuses.IN_PROGRESS.code,
        taskStatuses.TRANSFERRED.code,
      ];

      const data = await getTaskQueue(states);

      const newIds = new Set(data.map((t) => t.id));
      let hasNewTask = false;
      for (const id of newIds) {
        if (!prevTaskIdsRef.current.has(id)) {
          hasNewTask = true;
          break;
        }
      }

      if (hasNewTask && prevTaskIdsRef.current.size > 0) {
        playAudio();
      }

      prevTaskIdsRef.current = newIds;

      const now = Date.now();
      const sec = {};
      data.forEach((t) => {
        if (t.state === taskStatuses.IN_PROGRESS.name && t.startedAt) {
          sec[t.id] = (t.displaySec || 0) + Math.floor((now - new Date(t.startedAt)) / 1000);
        } else {
          sec[t.id] = t.displaySec || 0;
        }
      });

      setTasks(data);
      setSecondsMap(sec);

      const running = data.find((t) => t.state === taskStatuses.IN_PROGRESS.name);
      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setSelectedTaskId((prev) => prev || data[0].id);
        setActiveTaskId(null);
      }
    } catch (err) {
      console.error(err);
      showPopup("Не удалось загрузить задачи", { type: "error" });
    }
  };

  useEffect(() => {
    loadTasks();
    pollingRef.current = setInterval(loadTasks, REFRESH_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, []);

  // таймер для всех IN_PROGRESS задач
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsMap((prev) => {
        const now = Date.now();
        const updated = { ...prev };
        tasks.forEach((t) => {
          if (t.state === taskStatuses.IN_PROGRESS.name && t.startedAt) {
            updated[t.id] = (t.displaySec || 0) + Math.floor((now - new Date(t.startedAt)) / 1000);
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const manageTaskState = async (id, newState) => {
    await curentTaskManage(String(id).padStart(9, "0"), newState);
    await loadTasks();
  };

  return {
    tasks,
    setTasks,
    secondsMap,
    selectedTaskId,
    setSelectedTaskId,
    activeTaskId,
    setActiveTaskId,
    manageTaskState,
    refreshTasks: loadTasks,
  };
};
