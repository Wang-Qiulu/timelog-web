import { useEffect } from 'react';
import { useTimerStore } from '../store/useTimerStore';
import Timer from './Timer';
import TimerForm from './TimerForm';
import ActionButtons from './ActionButtons';

export default function Header({ username }) {
  const tick = useTimerStore(state => state.tick);
  const timerState = useTimerStore(state => state.timerState);

  useEffect(() => {
    let interval;
    if (timerState === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerState, tick]);

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {username && (
          <div className="text-lg font-medium text-gray-600">
            {username}
          </div>
        )}
        <Timer />
        <TimerForm />
        <ActionButtons />
      </div>
    </header>
  );
}