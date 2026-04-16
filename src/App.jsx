import { useEffect, useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { useLogsStore } from './store/useLogsStore';
import { auth, signInAnon } from './firebase/config';

export default function App() {
  const fetchLogs = useLogsStore(state => state.fetchLogs);
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setInitialized(true);
      if (user) fetchLogs();
    });
    return () => unsubscribe();
  }, [fetchLogs]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <button
          onClick={async () => {
            try {
              await signInAnon();
            } catch (e) {
              console.error('登录失败:', e);
              alert('登录失败: ' + e.message);
            }
          }}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
        >
          开始使用
        </button>
      </div>
    );
  }

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