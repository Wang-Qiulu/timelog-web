import { useEffect, useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { useLogsStore } from './store/useLogsStore';
import { useUserStore } from './store/useUserStore';
import { auth, signInAnon } from './firebase/config';

export default function App() {
  const fetchLogs = useLogsStore(state => state.fetchLogs);
  const username = useUserStore(state => state.username);
  const saveUsername = useUserStore(state => state.saveUsername);
  const fetchUsername = useUserStore(state => state.fetchUsername);

  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState(null);
  const [inputName, setInputName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameError, setNameError] = useState('');

  // 验证用户名
  const validateName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      return '用户名需要2-20个字';
    }
    if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(trimmed)) {
      return '只能使用中文、英文、数字';
    }
    return '';
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      await signInAnon();
    } catch (e) {
      console.error('登录失败:', e);
      alert('登录失败: ' + e.message);
    }
  };

  // 处理保存用户名
  const handleSaveName = async () => {
    const error = validateName(inputName);
    if (error) {
      setNameError(error);
      return;
    }
    await saveUsername(inputName.trim());
    setShowNameInput(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setInitialized(true);

      if (user) {
        await fetchUsername();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && username === '') {
      setShowNameInput(true);
    }
  }, [user, username]);

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
          onClick={handleLogin}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
        >
          开始使用
        </button>
      </div>
    );
  }

  if (showNameInput || !username) {
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
            placeholder="2-20字，中文/英文/数字"
            className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 mb-2"
          />
          {nameError && <p className="text-red-500 text-sm mb-2">{nameError}</p>}
          <button
            onClick={handleSaveName}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
          >
            确定
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