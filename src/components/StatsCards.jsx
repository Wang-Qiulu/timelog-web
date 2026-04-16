import { useMemo } from 'react';
import { useLogsStore } from '../store/useLogsStore';
import { formatMinutes } from '../utils/time.js';
import { getCategories } from '../constants/categories';

export default function StatsCards() {
  const logs = useLogsStore(state => state.logs);
  const categories = getCategories();

  const stats = useMemo(() => {
    const totalDuration = logs.reduce((sum, log) => sum + log.duration, 0);
    const aCategory = categories.find(c => c.id === 'A');
    const aDuration = logs
      .filter(log => log.categoryId === 'A')
      .reduce((sum, log) => sum + log.duration, 0);

    return { totalDuration, aDuration, aCategoryName: aCategory?.name || '核心产出' };
  }, [logs, categories]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm text-gray-500 mb-1">今日总时长</div>
        <div className="text-2xl font-medium text-gray-900">
          {formatMinutes(stats.totalDuration)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm text-gray-500 mb-1">{stats.aCategoryName}</div>
        <div className="text-2xl font-medium text-gray-900">
          {formatMinutes(stats.aDuration)}
        </div>
      </div>
    </div>
  );
}