import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogsStore } from '../store/useLogsStore';
import TimelineItem from './TimelineItem';

export default function Timeline() {
  const logs = useLogsStore(state => state.logs);
  const fetchLogs = useLogsStore(state => state.fetchLogs);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">今日记录</h2>
      <div className="max-h-96 overflow-y-auto">
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">暂无记录</p>
        ) : (
          <AnimatePresence>
            {logs.map(log => (
              <TimelineItem key={log.id} log={log} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}