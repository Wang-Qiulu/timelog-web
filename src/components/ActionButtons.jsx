import { motion, AnimatePresence } from 'framer-motion';
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
    // 强制刷新状态
    window.location.reload();
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
      <motion.button
        onClick={handleStart}
        disabled={timerState === 'running'}
        className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        whileTap={{ scale: 0.98 }}
        animate={timerState === 'running' ? { opacity: 0.5 } : {}}
      >
        {timerState === 'running' ? '进行中...' : '开始'}
      </motion.button>

      <AnimatePresence>
        {timerState === 'running' && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex items-center gap-3"
          >
            <motion.button
              onClick={handleComplete}
              disabled={!canComplete}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              whileTap={canComplete ? { scale: 0.98 } : {}}
            >
              完成并记录
            </motion.button>

            <motion.button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2"
              whileTap={{ scale: 0.95 }}
            >
              放弃
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}