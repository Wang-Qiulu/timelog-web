import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogsStore } from '../store/useLogsStore';
import { getAllLogs } from '../db/cloudDb';
import TimelineItem from './TimelineItem';

export default function Timeline({ mode = 'today' }) {
  const logs = useLogsStore(state => state.logs);
  const fetchLogs = useLogsStore(state => state.fetchLogs);
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (mode === 'history') {
      getAllLogs().then(setHistoryLogs);
    }
  }, [mode]);

  const displayLogs = mode === 'today' ? logs : historyLogs;

  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {mode === 'today' ? '今日记录' : '历史记录'}
        </h2>
        {mode === 'today' ? (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switchMode', { detail: 'history' }))}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            查看历史
          </button>
        ) : (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('switchMode', { detail: 'today' }))}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            返回今日
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {displayLogs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">暂无记录</p>
        ) : (
          <AnimatePresence>
            {displayLogs.map(log => (
              <TimelineItem key={log.id} log={log} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}