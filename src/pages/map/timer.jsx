import { useState, useEffect, useMemo, useCallback } from "react";

export function SimulationTimer({ 
  duration = 300, // Default duration in seconds
  isRunning = false, 
  onEnd
}) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Countdown Logic
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (onEnd) onEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // Fixed 1 second interval (no speed multiplier)
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onEnd]);

  // Handler for "End Now"
  const handleEnd = useCallback(() => {
    setTimeLeft(0);
    if (onEnd) onEnd();
  }, [onEnd]);

  // Reset timer if duration changes or we restart (optional safety)
  useEffect(() => {
    if (!isRunning && timeLeft === 0) {
        setTimeLeft(duration);
    }
  }, [isRunning, duration, timeLeft]);

  // Formatting (HH:MM:SS)
  const timeString = useMemo(() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = Math.floor(timeLeft % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  // Don't render if not running (optional, remove if you want it visible always)
  if (!isRunning && timeLeft === duration) return null;

  return (
    <div className="fixed right-4 bottom-4 z-[1000]">
      <div className="bg-black/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-2 ring-white/25 p-6 flex flex-col items-end gap-1">
        
        {/* Status Light & Title */}
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${isRunning && timeLeft > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <div className="text-xs text-white/60 font-arame uppercase tracking-widest">
            Mission Clock
            </div>
        </div>

        {/* Time Display */}
        <div className="font-arame text-7xl text-white/90 tabular-nums leading-none tracking-tight my-1">
          {timeString}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-1">
          <button
            type="button"
            onClick={handleEnd}
            className="text-xs font-arame text-red-500 uppercase px-2 py-0.5 ring-1 ring-white/25 transition
              hover:bg-red-500/25 hover:ring-red-500 hover:cursor-pointer hover:text-red-400"
          >
            End Now
          </button>
        </div>
      </div>
    </div>
  );
}