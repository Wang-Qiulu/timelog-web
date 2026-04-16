import { formatDuration } from '../utils/time.js';
import { useTimerStore } from '../store/useTimerStore';

export default function Timer() {
  const currentTime = useTimerStore(state => state.currentTime);

  return (
    <div className="text-6xl font-light tracking-tight">
      {formatDuration(currentTime)}
    </div>
  );
}