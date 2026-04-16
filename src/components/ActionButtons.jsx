import { useTimerStore } from '../store/useTimerStore';
import { useLogsStore } from '../store/useLogsStore';

export default function ActionButtons() {
  const timerState = useTimerStore(state => state.timerState);
  const description = useTimerStore(state => state.description);
  const categoryId = useTimerStore(state => state.categoryId);
  const start = useTimerStore(state => state.start);
  const reset = useTimerStore(state => state.reset);
  const complete = useTimerStore(state => state.complete);
  const addLog = useLogsStore(state => state.addLog);

  const canComplete = timerState === 'running' && description.trim() && categoryId;

  const handleComplete = async () => {
    const log = await complete();
    if (log) {
      await addLog(log);
    }
  };

  const handleStart = () => {
    if (timerState === 'idle') {
      start();
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleStart}
        disabled={timerState === 'running'}
        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {timerState === 'running' ? '进行中...' : '开始'}
      </button>

      {timerState === 'running' && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleComplete}
            disabled={!canComplete}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            完成并记录
          </button>

          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2"
          >
            放弃
          </button>
        </div>
      )}
    </div>
  );
}