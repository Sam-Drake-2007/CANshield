import { useState, useEffect, useMemo, useCallback } from "react";

export function SimulationTimer({ 
  seconds = 60, // Initial duration on first load
  speed = 1, 
  isRunning = false, 
  onEnd
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [active, setActive] = useState(isRunning);

  // Constant for the restart duration (5 minutes)
  const RESTART_DURATION = 300; 

  // Countdown Logic
  useEffect(() => {
    let interval = null;

    if (active && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Check if we are about to hit zero
          if (prev <= 1) {
            clearInterval(interval);
            setActive(false);
            if (onEnd) onEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000 / speed);
    } else if (timeLeft <= 0) {
      // Safety check to ensure we stop if we hit 0 externally
      setActive(false);
    }

    return () => clearInterval(interval);
  }, [active, timeLeft, speed, onEnd]);

  // Handlers
  const handleToggle = () => {
    if (timeLeft <= 0) {
      // If time is up, reset to 5 minutes and start
      setTimeLeft(RESTART_DURATION);
      setActive(true);
    } else {
      // Otherwise just toggle pause/play
      setActive(!active);
    }
  };
  
  const handleEnd = useCallback(() => {
    setActive(false);
    setTimeLeft(0);
    if (onEnd) onEnd();
  }, [onEnd]);

  // Formatting
  const timeString = useMemo(() => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = Math.floor(timeLeft % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  // Determine button label
  const getButtonLabel = () => {
    if (active) return "Pause";
    if (timeLeft <= 0) return "Restart 5m";
    return "Resume";
  };

  return (
    <div className="fixed right-4 bottom-4 z-[1000]">
      <div className="bg-black/50 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-2 ring-white/25 p-6 flex flex-col items-end gap-1">
        
        {/* Status Light & Title */}
        <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
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
          <div className="text-xs font-arame text-white/60">
            SPEED: <span className="text-white/90">{speed}x</span>
          </div>
          
          <div className="h-4 w-[1px] bg-white/20" />
          
          <button
            type="button"
            onClick={handleToggle}
            className="text-xs font-arame text-white/80 uppercase px-2 py-0.5 ring-1 ring-white/25 transition
              hover:bg-blue-500/60 hover:ring-blue-500 hover:text-blue-100"
          >
            {getButtonLabel()}
          </button>

          <button
            type="button"
            onClick={handleEnd}
            className="text-xs font-arame text-red-500 uppercase px-2 py-0.5 ring-1 ring-white/25 transition
              hover:bg-red-500/25 hover:ring-red-500 hover:cursor-pointer hover:text-red-400"
          >
            End
          </button>
        </div>
      </div>
    </div>
  );
}