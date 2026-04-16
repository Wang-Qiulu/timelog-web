import { motion } from 'framer-motion';
import { formatTime, formatMinutes } from '../utils/time.js';
import { getCategories } from '../constants/categories';
import { useLogsStore } from '../store/useLogsStore';

export default function TimelineItem({ log }) {
  const deleteLog = useLogsStore(state => state.deleteLog);
  const categories = getCategories();
  const category = categories.find(c => c.id === log.categoryId) || categories[0];

  const handleDelete = () => {
    if (confirm('确定删除这条记录吗？')) {
      deleteLog(log.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0"
    >
      <div
        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
        style={{ backgroundColor: category.color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{formatTime(log.startTime)}</span>
          <span>-</span>
          <span>{formatTime(log.endTime)}</span>
          <span className="text-gray-300">|</span>
          <span>{formatMinutes(log.duration)}</span>
        </div>
        <div className="text-gray-900 mt-1 truncate">
          {log.description}
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="text-gray-300 hover:text-gray-500 transition-colors p-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}