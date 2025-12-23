import { useEffect, useRef } from "react";

export const useTaskAudio = () => {
  const audioRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/000000002.mp3");
    audioRef.current.volume = 0.4;

    const unlockAudio = () => {
      if (audioUnlockedRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioUnlockedRef.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  const play = () => {
    if (audioUnlockedRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  return { play, audioUnlockedRef };
};
