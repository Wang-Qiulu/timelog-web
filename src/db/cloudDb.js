import { addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useUserStore } from '../store/useUserStore';

const COLLECTION = 'timeLogs';

function getUsername() {
  const state = useUserStore.getState();
  console.log('getUsername:', state.username); // 调试
  return state.username;
}

export async function addLog(log) {
  const username = getUsername();
  if (!username) {
    console.error('addLog: 用户名空'); // 调试
    throw new Error('用户未登录');
  }

  return addDoc(collection(db, 'users', username, COLLECTION), {
    ...log,
    username,
    createdAt: Date.now(),
  });
}

export async function getLogsByDate(date) {
  const username = getUsername();
  if (!username) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'users', username, COLLECTION),
    where('endTime', '>=', startOfDay.getTime()),
    where('endTime', '<=', endOfDay.getTime()),
    orderBy('endTime', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllLogs() {
  const username = getUsername();
  if (!username) return [];

  const q = query(collection(db, 'users', username, COLLECTION), orderBy('endTime', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateLog(id, updates) {
  const username = getUsername();
  if (!username) throw new Error('用户未登录');

  return updateDoc(doc(db, 'users', username, COLLECTION, id), updates);
}

export async function deleteLog(id) {
  const username = getUsername();
  console.log('deleteLog:', username, id); // 调试
  if (!username) {
    console.error('deleteLog: 用户名空');
    throw new Error('用户未登录');
  }

  const docRef = doc(db, 'users', username, COLLECTION, id);
  return deleteDoc(docRef);
}