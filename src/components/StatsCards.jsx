import { useMemo } from 'react';
import { useLogsStore } from '../store/useLogsStore';
import { formatMinutes } from '../utils/time.js';
import { getCategories } from '../constants/categories';
import { getAllLogs } from '../db/cloudDb';
import { useState, useEffect } from 'react';

export default function StatsCards({ mode = 'today' }) {
  const logs = useLogsStore(state => state.logs);
  const [historyLogs, setHistoryLogs] = useState([]);
  const categories = getCategories();

  useEffect(() => {
    if (mode === 'history') {
      getAllLogs().then(setHistoryLogs);
    }
  }, [mode]);

  const displayLogs = mode === 'today' ? logs : historyLogs;

  const stats = useMemo(() => {
    const totalDuration = displayLogs.reduce((sum, log) => sum + log.duration, 0);
    const aCategory = categories.find(c => c.id === 'A');
    const aDuration = displayLogs
      .filter(log => log.categoryId === 'A')
      .reduce((sum, log) => sum + log.duration, 0);

    return { totalDuration, aDuration, aCategoryName: aCategory?.name || '核心产出' };
  }, [displayLogs, categories]);

  const title = mode === 'today' ? '今日总时长' : '历史总时长';
  const aTitle = mode === 'today' ? stats.aCategoryName : `历史${stats.aCategoryName}`;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm text-gray-500 mb-1">{title}</div>
        <div className="text-2xl font-medium text-gray-900">
          {formatMinutes(stats.totalDuration)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="text-sm text-gray-500 mb-1">{aTitle}</div>
        <div className="text-2xl font-medium text-gray-900">
          {formatMinutes(stats.aDuration)}
        </div>
      </div>
    </div>
  );
}