import { useState, useEffect, useRef, useCallback } from "react";
import { getTaskQueue } from "../../../../../api/get/getTaskQueue";
import { curentTaskManage } from "../../../../../api/curentTaskManage";
import { taskStatuses } from "../../../../../modules/taskStatuses";

const REFRESH_INTERVAL_MS = 17000;

export const useTasks = (showPopup, playAudio) => {
 
  const [tasks, setTasks] = useState([]);
  const [secondsMap, setSecondsMap] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const tasksRef = useRef([]);
  const prevTaskIdsRef = useRef(new Set());
  const showPopupRef = useRef(showPopup);
  const playAudioRef = useRef(playAudio);

  // ---------------------------------------------
  // стабилизация внешних функций
  useEffect(() => {
    showPopupRef.current = showPopup;
  }, [showPopup]);

  useEffect(() => {
    playAudioRef.current = playAudio;
  }, [playAudio]);

  // ---------------------------------------------
  // Загрузка задач (API)
  const loadTasks = useCallback(async () => {
    try {
      const states = [
        taskStatuses.PAUSED.code,
        taskStatuses.IN_PROGRESS.code,
        taskStatuses.TRANSFERRED.code,
      ];

      const data = await getTaskQueue(states);

      tasksRef.current = data;

      const newIds = new Set(data.map((t) => t.id));
      let hasNewTask = false;

      for (const id of newIds) {
        if (!prevTaskIdsRef.current.has(id)) {
          hasNewTask = true;
          break;
        }
      }

      if (hasNewTask && prevTaskIdsRef.current.size > 0) {
        playAudioRef.current?.();
      }

      prevTaskIdsRef.current = newIds;

      const now = Date.now();
      const sec = {};

      data.forEach((t) => {
        if (t.state === taskStatuses.IN_PROGRESS.name && t.startedAt) {
          const startedTs = new Date(t.startedAt).getTime();
          const delta = Math.floor((now - startedTs) / 1000);
          sec[t.id] = Math.max(t.displaySec || 0, delta);
        } else {
          sec[t.id] = t.displaySec || 0;
        }
      });

      setTasks(data);
      setSecondsMap(sec);

      const running = data.find(
        (t) => t.state === taskStatuses.IN_PROGRESS.name
      );

      if (running) {
        setActiveTaskId(running.id);
        setSelectedTaskId((prev) => prev || running.id);
      } else if (data.length > 0) {
        setActiveTaskId(null);
        setSelectedTaskId((prev) => prev || data[0].id);
      } else {
        setActiveTaskId(null);
        setSelectedTaskId(null);
      }
    } catch (err) {
      console.error(err);
      showPopupRef.current?.("Не удалось загрузить задачи", {
        type: "error",
      });
    }
  }, []);

  // ---------------------------------------------
  // Polling API (17 секунд)
  useEffect(() => {
    loadTasks();

    const id = setInterval(loadTasks, REFRESH_INTERVAL_MS);

    return () => clearInterval(id);
  }, [loadTasks]);

  // ---------------------------------------------
  // Секундный таймер (без зависимости от tasks!)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const now = Date.now();
  //     const updated = {};

  //     tasksRef.current.forEach((t) => {
  //       if (t.state === taskStatuses.IN_PROGRESS.name && t.startedAt) {
  //         const startedTs = new Date(t.startedAt).getTime();
  //         const delta = Math.floor((now - startedTs) / 1000);
  //         updated[t.id] = Math.max(t.displaySec || 0, delta);
  //       } else {
  //         updated[t.id] = t.displaySec || 0;
  //       }
  //     });

  //     setSecondsMap(updated);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  // ---------------------------------------------
  const manageTaskState = useCallback(
    async (id, newState) => {
      await curentTaskManage(String(id).padStart(9, "0"), newState);
      await loadTasks();
    },
    [loadTasks]
  );

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
