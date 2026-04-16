import { create } from 'zustand';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

const COLLECTION = 'users';

export const useUserStore = create((set, get) => ({
  username: '',
  loading: false,

  // 从Firebase获取用户名
  fetchUsername: async () => {
    if (!auth.currentUser) return;
    set({ loading: true });

    try {
      const uid = auth.currentUser.uid;
      const docRef = doc(db, COLLECTION, uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        set({ username: data.username || '', loading: false });
      } else {
        set({ username: '', loading: false });
      }
    } catch (error) {
      console.error('获取用户名失败:', error);
      set({ loading: false });
    }
  },

  // 保存用户名到Firebase
  saveUsername: async (username) => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    await setDoc(doc(db, COLLECTION, uid), { username }, { merge: true });
    set({ username });
  },
}));