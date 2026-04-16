import { create } from 'zustand';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/config';

const USERS_COLLECTION = 'users';

export const useUserStore = create((set, get) => ({
  username: '',
  loading: false,
  error: '',

  // 从localStorage获取用户名
  init: () => {
    const saved = localStorage.getItem('timelog_username');
    if (saved) {
      set({ username: saved });
    }
  },

  // 检查用户名是否存在云端
  checkUsername: async (username) => {
    const docRef = doc(db, USERS_COLLECTION, username);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  },

  // 保存用户名
  saveUsername: async (username) => {
    set({ loading: true, error: '' });

    try {
      // 检查是否已存在
      const exists = await get().checkUsername(username);
      if (exists) {
        set({ error: '名字已存在，请换一个', loading: false });
        return false;
      }

      // 创建用户记录
      await setDoc(doc(db, USERS_COLLECTION, username), {
        createdAt: Date.now(),
      });

      // 存localStorage
      localStorage.setItem('timelog_username', username);
      set({ username, loading: false });
      return true;
    } catch (error) {
      console.error('保存失败:', error);
      set({ error: '保存失败，请重试', loading: false });
      return false;
    }
  },

  // 加载已有用户名（不创建）
  loadUsername: async (username) => {
    const exists = await get().checkUsername(username);
    if (exists) {
      localStorage.setItem('timelog_username', username);
      set({ username });
    } else {
      // 不是有效用户，清除localStorage
      localStorage.removeItem('timelog_username');
      set({ error: '用户不存在，请重新输入', username: '' });
    }
  },
}));