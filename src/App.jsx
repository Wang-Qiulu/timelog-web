import { useEffect } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { useLogsStore } from './store/useLogsStore';

export default function App() {
  const fetchLogs = useLogsStore(state => state.fetchLogs);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Timeline />
          </div>
          <div className="lg:col-span-1">
            <Dashboard />
          </div>
        </div>
        <div className="mt-8">
          <Settings />
        </div>
      </main>
    </div>
  );
}