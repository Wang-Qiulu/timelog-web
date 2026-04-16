import { useEffect, useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { useLogsStore } from './store/useLogsStore';
import { useUserStore } from './store/useUserStore';

export default function App() {
  const fetchLogs = useLogsStore(state => state.fetchLogs);
  const username = useUserStore(state => state.username);
  const saveUsername = useUserStore(state => state.saveUsername);
  const init = useUserStore(state => state.init);
  const error = useUserStore(state => state.error);
  const loading = useUserStore(state => state.loading);

  const [inputName, setInputName] = useState('');
  const [nameError, setNameError] = useState('');
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState('today'); // today | history

  // 监听切换模式事件
  useEffect(() => {
    const handler = (e) => setMode(e.detail);
    window.addEventListener('switchMode', handler);
    return () => window.removeEventListener('switchMode', handler);
  }, []);

  // 初始化 - 检查localStorage
  useEffect(() => {
    init();
  }, []);

  // localStorage有用户名，直接获取数据
  useEffect(() => {
    if (username) {
      fetchLogs();
      setReady(true);
    }
  }, [username, fetchLogs]);

  // 验证用户名
  const validateName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      return '需要2-20个字';
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(trimmed)) {
      return '只能使用中文、英文、数字';
    }
    return '';
  };

  // 保存用户名
  const handleSave = async () => {
    const error = validateName(inputName);
    if (error) {
      setNameError(error);
      return;
    }

    setNameError('');
    const success = await saveUsername(inputName.trim());
    if (success) {
      setReady(true);
    }
  };

  // 切换模式
  const switchMode = (newMode) => {
    setMode(newMode);
    window.dispatchEvent(new CustomEvent('switchMode', { detail: newMode }));
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-medium mb-4">欢迎使用</h2>
          <p className="text-gray-500 mb-4">请输入你的名字</p>
          <input
            type="text"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
              setNameError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="2-20字，中文/英文/数字"
            className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 mb-2"
          />
          {(nameError || error) && (
            <p className="text-red-500 text-sm mb-2">{nameError || error}</p>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '保存中...' : '确定'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header username={username} />
      <main className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Timeline mode={mode} />
          </div>
          <div className="lg:col-span-1">
            <Dashboard mode={mode} />
          </div>
        </div>
        <div className="mt-8">
          <Settings />
        </div>
      </main>
    </div>
  );
}